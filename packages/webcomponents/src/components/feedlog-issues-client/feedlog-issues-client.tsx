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
   * Maximum number of issues per page (1-100, default 10)
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
   * Pagination strategy: 'load-more' appends issues with a button,
   * 'prev-next' shows prev/next arrow navigation with prefetching.
   */
  @Prop() paginationType: 'load-more' | 'prev-next' = 'load-more';

  /**
   * Label for the load-more button (load-more pagination mode only).
   */
  @Prop() loadMoreLabel: string = 'Load More';

  /**
   * Minimum time in ms to display skeleton placeholders before replacing
   * with real data. Prevents flickering on fast networks.
   */
  @Prop() minSkeletonTime: number = 250;

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

  /** Cached page arrays for prev-next mode */
  @State() pages: FeedlogIssueType[][] = [];
  @State() currentPageIndex: number = 0;
  @State() hasPrev: boolean = false;

  private sdk: FeedlogSDK | null = null;
  /** Counter to track fetch operations and prevent stale updates */
  private fetchRequestId: number = 0;
  /** Flag to prevent state updates after component disconnect */
  private isDisconnected: boolean = false;
  /** Whether a prefetch is already in flight (prev-next mode) */
  private isPrefetching: boolean = false;

  /** Map to track the latest upvote request ID for each issue to handle race conditions */
  private upvoteRequestIds: Map<string, number> = new Map();

  componentWillLoad() {
    this.initializeSDK();
    if (this.issues.length > 0 && !this.loading) {
      // SSR/hydration can restore issues (and hasMore) without the pagination cursor,
      // because cursor is internal state and may not be serialized. Skipping fetch
      // would leave cursor unset so "load more" repeats the first page.
      if (!this.hasMore || this.cursor != null) {
        return;
      }
    }
    if (this.paginationType === 'prev-next') {
      return this.fetchPagesInitial();
    }
    return this.fetchIssues();
  }

  disconnectedCallback() {
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
    this.fetchRequestId++;
    this.cursor = null;
    this.hasMore = false;
    this.issues = [];
    this.pages = [];
    this.currentPageIndex = 0;
    this.hasPrev = false;
    this.isPrefetching = false;
    this.upvoteRequestIds.clear();

    if (this.paginationType === 'prev-next') {
      await this.fetchPagesInitial();
    } else {
      await this.fetchIssues();
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

    if (this.cursor != null && this.cursor !== '') {
      params.cursor = this.cursor;
    }

    return params;
  }

  // ── Load More mode ──

  private async fetchIssues() {
    if (!this.sdk) {
      return;
    }

    const currentRequestId = this.fetchRequestId;

    try {
      this.loading = true;
      this.error = null;

      const params = this.buildFetchParams();
      const response = await this.sdk.fetchIssues(params);

      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      this.issues = response.issues;
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
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

    const currentRequestId = this.fetchRequestId;
    this.isLoadingMore = true;

    try {
      const [response] = await Promise.all([
        this.sdk.fetchIssues(this.buildFetchParams()),
        new Promise<void>(resolve => setTimeout(resolve, this.minSkeletonTime)),
      ]);

      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      this.issues = [...this.issues, ...response.issues];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to load more issues';
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      if (!this.isDisconnected && currentRequestId === this.fetchRequestId) {
        this.isLoadingMore = false;
      }
    }
  }

  // ── Prev / Next mode ──

  private get pageSize(): number {
    return this.limit ?? 10;
  }

  /**
   * Fetch 2x limit from API, split into page-sized chunks, and append to cache.
   */
  private async fetchPagesInitial() {
    if (!this.sdk) {
      return;
    }

    const currentRequestId = this.fetchRequestId;

    try {
      this.loading = true;
      this.error = null;

      const params = this.buildFetchParams();
      params.limit = this.pageSize * 2;

      const response = await this.sdk.fetchIssues(params);

      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const newPages = this.splitIntoPages(response.issues);
      this.pages = newPages;
      this.currentPageIndex = 0;
      this.hasPrev = false;
      this.issues = newPages[0] ?? [];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const errorMsg = err instanceof Error ? err.message : "Couldn't load updates";
      this.error = errorMsg;
      this.issues = [];
      this.pages = [];
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      if (!this.isDisconnected && currentRequestId === this.fetchRequestId) {
        this.loading = false;
      }
    }
  }

  /**
   * Prefetch additional pages in the background (fire-and-forget).
   */
  private async prefetchPages() {
    if (!this.sdk || !this.hasMore || this.isPrefetching) {
      return;
    }

    const currentRequestId = this.fetchRequestId;
    this.isPrefetching = true;

    try {
      const params = this.buildFetchParams();
      params.limit = this.pageSize * 2;

      const response = await this.sdk.fetchIssues(params);

      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const newPages = this.splitIntoPages(response.issues);
      this.pages = [...this.pages, ...newPages];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (_err) {
      // Prefetch failures are non-critical; next navigation will retry
    } finally {
      if (!this.isDisconnected && currentRequestId === this.fetchRequestId) {
        this.isPrefetching = false;
      }
    }
  }

  private splitIntoPages(issues: FeedlogIssueType[]): FeedlogIssueType[][] {
    const result: FeedlogIssueType[][] = [];
    for (let i = 0; i < issues.length; i += this.pageSize) {
      result.push(issues.slice(i, i + this.pageSize));
    }
    return result;
  }

  private goToPage(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.currentPageIndex > 0) {
      this.currentPageIndex--;
    } else if (direction === 'next') {
      const nextIndex = this.currentPageIndex + 1;

      if (nextIndex < this.pages.length) {
        this.currentPageIndex = nextIndex;
      } else if (this.hasMore) {
        // Need to fetch more pages before we can advance
        void this.fetchAndAdvance();
        return;
      } else {
        return;
      }

      // Prefetch when we're near the end of the cache
      if (this.currentPageIndex >= this.pages.length - 1 && this.hasMore) {
        void this.prefetchPages();
      }
    }

    this.hasPrev = this.currentPageIndex > 0;
    this.issues = this.pages[this.currentPageIndex] ?? [];
  }

  /**
   * When navigating Next but we have no cached page, fetch and then advance.
   */
  private async fetchAndAdvance() {
    if (!this.sdk || this.isLoadingMore) {
      return;
    }

    const currentRequestId = this.fetchRequestId;
    this.isLoadingMore = true;

    try {
      const params = this.buildFetchParams();
      params.limit = this.pageSize * 2;

      const response = await this.sdk.fetchIssues(params);

      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const newPages = this.splitIntoPages(response.issues);
      this.pages = [...this.pages, ...newPages];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;

      if (newPages.length > 0) {
        this.currentPageIndex++;
        this.hasPrev = this.currentPageIndex > 0;
        this.issues = this.pages[this.currentPageIndex] ?? [];
      }
    } catch (err) {
      if (this.isDisconnected || currentRequestId !== this.fetchRequestId) {
        return;
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to load more issues';
      this.feedlogError.emit({
        error: errorMsg,
        code: (err as any)?.statusCode,
      });
    } finally {
      if (!this.isDisconnected && currentRequestId === this.fetchRequestId) {
        this.isLoadingMore = false;
      }
    }
  }

  // ── Upvotes (shared) ──

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

    const requestId = (this.upvoteRequestIds.get(issueId) || 0) + 1;
    this.upvoteRequestIds.set(issueId, requestId);

    const updateIssue = (issues: FeedlogIssueType[], patch: Partial<FeedlogIssueType>) =>
      issues.map(i => (i.id === issueId ? { ...i, ...patch } : i));

    // Optimistic update
    this.issues = updateIssue(this.issues, { hasUpvoted: upvoted, upvoteCount });
    if (this.paginationType === 'prev-next') {
      this.pages = this.pages.map(page => updateIssue(page, { hasUpvoted: upvoted, upvoteCount }));
    }

    try {
      const result = await this.sdk.toggleUpvote(issueId);

      if (this.isDisconnected || this.upvoteRequestIds.get(issueId) !== requestId) {
        return;
      }

      const serverPatch = { hasUpvoted: result.upvoted, upvoteCount: result.upvoteCount };
      this.issues = updateIssue(this.issues, serverPatch);
      if (this.paginationType === 'prev-next') {
        this.pages = this.pages.map(page => updateIssue(page, serverPatch));
      }

      this.feedlogUpvote.emit({
        issueId,
        upvoted: result.upvoted,
        upvoteCount: result.upvoteCount,
      });
    } catch (err) {
      if (this.isDisconnected || this.upvoteRequestIds.get(issueId) !== requestId) {
        return;
      }

      const revertPatch = {
        hasUpvoted: currentIssue.hasUpvoted,
        upvoteCount: currentIssue.upvoteCount,
      };
      this.issues = updateIssue(this.issues, revertPatch);
      if (this.paginationType === 'prev-next') {
        this.pages = this.pages.map(page => updateIssue(page, revertPatch));
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle upvote';
      this.feedlogError.emit({ error: errorMsg });
    }
  };

  // ── Render ──

  render() {
    const hostBg = this.el?.style?.getPropertyValue('--feedlog-background');
    const style = hostBg
      ? ({ '--feedlog-background': hostBg } as Record<string, string>)
      : undefined;

    const hasMoreOrNextCached =
      this.paginationType === 'prev-next'
        ? this.hasMore || this.currentPageIndex < this.pages.length - 1
        : this.hasMore;

    return (
      <feedlog-issues
        style={style}
        issues={this.issues}
        limit={this.limit}
        paginationType={this.paginationType}
        loadMoreLabel={this.loadMoreLabel}
        maxWidth={this.maxWidth}
        theme={this.theme}
        heading={this.heading}
        subtitle={this.subtitle}
        emptyStateTitle={this.emptyStateTitle}
        emptyStateMessage={this.emptyStateMessage}
        getIssueUrl={this.getIssueUrl}
        loading={this.loading}
        error={this.error}
        hasMore={hasMoreOrNextCached}
        hasPrev={this.hasPrev}
        isLoadingMore={this.isLoadingMore}
        onFeedlogUpvote={this.handleUpvote}
        onFeedlogRetry={() => void this.resetAndRefetchIssues()}
        onFeedlogLoadMore={async () => this.loadMore()}
        onFeedlogPageChange={(e: CustomEvent<{ direction: 'prev' | 'next' }>) =>
          this.goToPage(e.detail.direction)
        }
      ></feedlog-issues>
    );
  }
}
