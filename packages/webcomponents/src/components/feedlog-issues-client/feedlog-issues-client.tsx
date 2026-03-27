import { Component, Element, Prop, Event, EventEmitter, h, State, Watch } from '@stencil/core';
import { FeedlogSDK, FetchIssuesParams } from '@feedlog-ai/core';
import type { FeedlogIssue as FeedlogIssueType, GetIssueUrlFn, SortBy } from '@feedlog-ai/core';

/**
 * Feedlog Issues Client Component
 *
 * A component for displaying issues fetched using the Feedlog SDK.
 * This component uses the SDK internally to fetch data and delegates to feedlog-issues for rendering.
 */
@Component({
  tag: 'feedlog-issues-client',
  shadow: true,
})
export class FeedlogIssuesClient {
  /**
   * API key for Feedlog authentication (required)
   * The API key determines which repositories' issues are fetched
   */
  /** Set via JS property only; not reflected to an HTML attribute (see Stencil `reflect`). */
  @Prop({ reflect: false }) apiKey!: string;

  /**
   * Filter issues by type: 'bug' or 'enhancement'
   */
  @Prop() type?: 'bug' | 'enhancement';

  /**
   * Maximum number of issues to fetch (1-100, default 10)
   */
  @Prop() limit?: number;

  /**
   * Sort issues by field: 'createdAt' or 'updatedAt'
   */
  @Prop() sortBy?: SortBy;

  /**
   * Custom API endpoint
   */
  @Prop() endpoint?: string;

  /**
   * Maximum width of the container
   */
  @Prop() maxWidth: string = '42rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Custom heading for the issues section
   */
  @Prop() heading?: string;

  /**
   * Custom subtitle for the issues section
   */
  @Prop() subtitle?: string;

  /**
   * Empty state title (e.g. "No updates yet")
   */
  @Prop() emptyStateTitle?: string;

  /**
   * Empty state message (e.g. "Check back later for new updates.")
   */
  @Prop() emptyStateMessage?: string;

  /**
   * Optional callback to resolve issue URL when githubIssueLink is not available.
   * Required because repository.owner was removed from the API for privacy.
   */
  @Prop() getIssueUrl?: GetIssueUrlFn;

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{ issueId: string; upvoted: boolean; upvoteCount: number }>;

  /**
   * Event emitted on error
   */
  @Event() feedlogError!: EventEmitter<{ error: string; code?: number }>;

  @Element() el!: HTMLElement;

  @State() issues: FeedlogIssueType[] = [];
  @State() loading: boolean = true;
  @State() error: string | null = null;
  @State() cursor: string | null = null;
  @State() hasMore: boolean = false;
  @State() isLoadingMore: boolean = false;

  private sdk: FeedlogSDK | null = null;
  /** Counter to track fetch operations and prevent stale updates */
  private fetchRequestId: number = 0;
  /** Flag to prevent state updates after component disconnect */
  private isDisconnected: boolean = false;

  /** Map to track the latest upvote request ID for each issue to handle race conditions */
  private upvoteRequestIds: Map<string, number> = new Map();

  componentWillLoad() {
    this.initializeSDK();
    // Return the promise so SSR waits for the fetch before serializing HTML.
    // During client hydration, skip fetch if we already have server-rendered data.
    if (this.issues.length > 0 && !this.loading) {
      return;
    }
    return this.fetchIssues();
  }

  disconnectedCallback() {
    // Prevent any pending async operations from updating state
    this.isDisconnected = true;
    this.fetchRequestId++;
  }

  @Watch('type')
  @Watch('limit')
  @Watch('sortBy')
  handleQueryParamChange(
    newValue: 'bug' | 'enhancement' | number | SortBy | undefined,
    oldValue: typeof newValue
  ) {
    if (newValue === oldValue) {
      return;
    }

    void this.resetAndRefetchIssues();
  }

  @Watch('apiKey')
  @Watch('endpoint')
  handleSdkConfigChange(newValue: string | undefined, oldValue: string | undefined) {
    if (newValue === oldValue) {
      return;
    }

    this.initializeSDK();
    void this.resetAndRefetchIssues();
  }

  private async resetAndRefetchIssues() {
    // Invalidate any in-flight requests and reset derived state before reloading.
    this.fetchRequestId++;
    this.cursor = null;
    this.hasMore = false;
    this.issues = [];
    this.upvoteRequestIds.clear();

    await this.fetchIssues();
  }

  private initializeSDK() {
    try {
      if (!this.apiKey) {
        throw new Error('API key is required for the Feedlog SDK');
      }

      this.sdk = new FeedlogSDK({
        apiKey: this.apiKey,
        ...(this.endpoint && { endpoint: this.endpoint }),
      });
      this.error = null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize SDK';
      this.error = errorMsg;
      this.feedlogError.emit({ error: errorMsg });
    }
  }

  private buildFetchParams(): FetchIssuesParams {
    const params: FetchIssuesParams = {};

    if (this.type) {
      params.type = this.type;
    }

    if (this.sortBy) {
      params.sortBy = this.sortBy;
    }

    if (this.limit) {
      params.limit = this.limit;
    }

    if (this.cursor) {
      params.cursor = this.cursor;
    }

    return params;
  }

  private async fetchIssues() {
    if (!this.sdk) {
      return;
    }

    // Capture current request ID to detect stale responses
    const currentRequestId = this.fetchRequestId;

    try {
      this.loading = true;
      this.error = null;

      const params = this.buildFetchParams();

      const response = await this.sdk.fetchIssues(params);

      // Ignore response if component disconnected or a newer request was made
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      this.issues = response.issues;
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      // Ignore errors from stale requests
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const errorMsg = err instanceof Error ? err.message : "Couldn't load updates";
      this.error = errorMsg;
      this.issues = [];
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      // Only update loading state if this is still the current request
      if (!this.isDisconnected && currentRequestId === this.fetchRequestId) {
        this.loading = false;
        this.isLoadingMore = false;
      }
    }
  }

  private async loadMore() {
    if (!this.sdk || !this.hasMore || this.isLoadingMore || this.loading) {
      return;
    }

    // Capture current request ID to detect stale responses
    const currentRequestId = this.fetchRequestId;

    this.isLoadingMore = true;

    try {
      const params = this.buildFetchParams();

      const response = await this.sdk.fetchIssues(params);

      // Ignore response if component disconnected or a newer request was made
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      this.issues = [...this.issues, ...response.issues];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      // Ignore errors from stale requests
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to load more issues';
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      // Only update loading state if this is still the current request
      if (!this.isDisconnected && currentRequestId === this.fetchRequestId) {
        this.isLoadingMore = false;
      }
    }
  }

  private handleUpvote = async (
    event: CustomEvent<{
      issueId: string;
      upvoted: boolean;
      upvoteCount: number;
    }>
  ) => {
    if (!this.sdk || this.isDisconnected) {
      return;
    }

    const { issueId, upvoted, upvoteCount } = event.detail;
    const currentIssue = this.issues.find(issue => issue.id === issueId);
    if (!currentIssue) {
      return;
    }

    // Track request to handle race conditions
    const requestId = (this.upvoteRequestIds.get(issueId) || 0) + 1;
    this.upvoteRequestIds.set(issueId, requestId);

    // Optimistic update
    this.issues = this.issues.map(issue =>
      issue.id === issueId
        ? {
            ...issue,
            hasUpvoted: upvoted,
            upvoteCount,
          }
        : issue
    );

    try {
      const result = await this.sdk.toggleUpvote(issueId);

      // Ignore if component disconnected or request is stale
      if (this.isDisconnected || this.upvoteRequestIds.get(issueId) !== requestId) {
        return;
      }

      // Update with server response
      this.issues = this.issues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              hasUpvoted: result.upvoted,
              upvoteCount: result.upvoteCount,
            }
          : issue
      );

      this.feedlogUpvote.emit({
        issueId,
        upvoted: result.upvoted,
        upvoteCount: result.upvoteCount,
      });
    } catch (err) {
      // Ignore if component disconnected or request is stale
      if (this.isDisconnected || this.upvoteRequestIds.get(issueId) !== requestId) {
        return;
      }

      // Revert optimistic update on error
      this.issues = this.issues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              hasUpvoted: currentIssue.hasUpvoted,
              upvoteCount: currentIssue.upvoteCount,
            }
          : issue
      );

      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle upvote';
      this.feedlogError.emit({ error: errorMsg });
    }
  };

  render() {
    // Explicitly forward --feedlog-background from host to child (inheritance can fail across nested shadow DOM)
    const hostBg = this.el?.style?.getPropertyValue('--feedlog-background');
    const style = hostBg
      ? ({ '--feedlog-background': hostBg } as Record<string, string>)
      : undefined;

    return (
      <feedlog-issues
        style={style}
        issues={this.issues}
        limit={this.limit}
        maxWidth={this.maxWidth}
        theme={this.theme}
        heading={this.heading}
        subtitle={this.subtitle}
        emptyStateTitle={this.emptyStateTitle}
        emptyStateMessage={this.emptyStateMessage}
        getIssueUrl={this.getIssueUrl}
        loading={this.loading}
        error={this.error}
        hasMore={this.hasMore}
        isLoadingMore={this.isLoadingMore}
        onFeedlogUpvote={this.handleUpvote}
        onFeedlogLoadMore={async () => this.loadMore()}
      ></feedlog-issues>
    );
  }
}
