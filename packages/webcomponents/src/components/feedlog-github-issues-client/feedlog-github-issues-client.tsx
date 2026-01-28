import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { FeedlogSDK, FetchIssuesParams } from '@feedlog-ai/core';
import type { FeedlogIssue as FeedlogIssueType } from '@feedlog-ai/core';

/**
 * Feedlog GitHub Issues Client Component
 *
 * A component for displaying GitHub issues fetched using the Feedlog SDK.
 * This component uses the SDK internally to fetch data and delegates to feedlog-github-issues for rendering.
 */
@Component({
  tag: 'feedlog-github-issues-client',
  shadow: true,
})
export class FeedlogGithubIssuesClient {
  /**
   * API key for Feedlog authentication (required)
   * The API key determines which repositories' issues are fetched
   */
  @Prop() apiKey!: string;

  /**
   * Filter issues by type: 'bug' or 'enhancement'
   */
  @Prop() type?: 'bug' | 'enhancement';

  /**
   * Maximum number of issues to fetch (1-100, default 10)
   */
  @Prop() limit?: number;

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
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{ issueId: string; upvoted: boolean; upvoteCount: number }>;

  /**
   * Event emitted on error
   */
  @Event() feedlogError!: EventEmitter<{ error: string; code?: number }>;

  @State() issues: FeedlogIssueType[] = [];
  @State() loading: boolean = true;
  @State() error: string | null = null;
  @State() cursor: string | null = null;
  @State() hasMore: boolean = false;
  @State() isLoadingMore: boolean = false;

  private sdk: FeedlogSDK | null = null;
  private previousType?: 'bug' | 'enhancement';
  private previousLimit?: number;

  componentWillLoad() {
    this.previousType = this.type;
    this.previousLimit = this.limit;
    this.initializeSDK();
    this.fetchIssues();
  }

  componentDidUpdate() {
    // Re-fetch if any props changed
    const typeChanged = this.previousType !== this.type;
    const limitChanged = this.previousLimit !== this.limit;

    if (typeChanged || limitChanged) {
      // Reset pagination when filters change
      this.cursor = null;
      this.hasMore = false;
      this.issues = [];

      this.fetchIssues();
      this.previousType = this.type;
      this.previousLimit = this.limit;
    }
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

  private async fetchIssues() {
    if (!this.sdk) {
      return;
    }

    try {
      this.loading = true;
      this.error = null;

      const params: FetchIssuesParams = {};

      if (this.type) {
        params.type = this.type;
      }

      if (this.limit) {
        params.limit = this.limit;
      }

      if (this.cursor) {
        params.cursor = this.cursor;
      }

      const response = await this.sdk.fetchIssues(params);
      this.issues = response.issues;
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch issues';
      this.error = errorMsg;
      this.issues = [];
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      this.loading = false;
      this.isLoadingMore = false;
    }
  }

  private async loadMore() {
    if (!this.sdk || !this.hasMore || this.isLoadingMore || this.loading) {
      return;
    }

    this.isLoadingMore = true;

    try {
      const params: FetchIssuesParams = {};

      if (this.type) {
        params.type = this.type;
      }

      if (this.limit) {
        params.limit = this.limit;
      }

      if (this.cursor) {
        params.cursor = this.cursor;
      }

      const response = await this.sdk.fetchIssues(params);
      this.issues = [...this.issues, ...response.issues];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load more issues';
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      this.isLoadingMore = false;
    }
  }

  private handleUpvote = async (
    event: CustomEvent<{
      issueId: string;
      currentUpvoted: boolean;
      currentCount: number;
    }>
  ) => {
    if (!this.sdk) {
      return;
    }

    const { issueId, currentUpvoted, currentCount } = event.detail;

    // Optimistic update
    this.issues = this.issues.map(issue =>
      issue.id === issueId
        ? {
            ...issue,
            hasUpvoted: !currentUpvoted,
            upvoteCount: currentUpvoted ? currentCount - 1 : currentCount + 1,
          }
        : issue
    );

    try {
      const result = await this.sdk.toggleUpvote(issueId);

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
      // Revert optimistic update on error
      this.issues = this.issues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              hasUpvoted: currentUpvoted,
              upvoteCount: currentCount,
            }
          : issue
      );

      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle upvote';
      this.feedlogError.emit({ error: errorMsg });
    }
  };

  render() {
    return (
      <feedlog-github-issues
        issues={this.issues}
        maxWidth={this.maxWidth}
        theme={this.theme}
        heading={this.heading}
        subtitle={this.subtitle}
        loading={this.loading}
        error={this.error}
        hasMore={this.hasMore}
        isLoadingMore={this.isLoadingMore}
        onFeedlogUpvote={this.handleUpvote}
        onFeedlogLoadMore={async () => this.loadMore()}
      ></feedlog-github-issues>
    );
  }
}
