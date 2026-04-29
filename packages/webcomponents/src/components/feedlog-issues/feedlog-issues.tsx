import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType, GetIssueUrlFn } from '@feedlog-ai/core';

/**
 * Feedlog Issues Component
 *
 * Component for displaying issues with support for bugs and enhancements.
 * Includes full list rendering, loading/error states, and pagination support.
 */
@Component({
  tag: 'feedlog-issues',
  styleUrl: 'feedlog-issues.css',
  shadow: true,
})
export class FeedlogIssues {
  /**
   * Array of issues to display
   */
  @Prop() issues: FeedlogIssueType[] = [];

  /**
   * Maximum width of the container
   */
  @Prop() maxWidth: string = '42rem';

  /**
   * Number of items per page. Used to determine skeleton count during load-more.
   */
  @Prop() limit?: number;

  /**
   * Pagination strategy: 'load-more' appends issues with a button,
   * 'prev-next' shows prev/next arrow navigation.
   */
  @Prop() paginationType: 'load-more' | 'prev-next' = 'load-more';

  /**
   * Label for the load-more button (load-more pagination mode only).
   */
  @Prop() loadMoreLabel: string = 'Load More';

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
   * Empty state title. Defaults to "Nothing to see here".
   */
  @Prop() emptyStateTitle?: string;

  /**
   * Empty state message. Defaults to "Check back later for the latest news and updates.".
   */
  @Prop() emptyStateMessage?: string;

  /**
   * Loading state - shows loading indicator when true
   */
  @Prop() loading: boolean = false;

  /**
   * Error message - shows error state when set
   */
  @Prop() error: string | null = null;

  /**
   * Whether there are more issues available (controls Next button / Load More visibility)
   */
  @Prop() hasMore: boolean = false;

  /**
   * Whether a previous page is available (for prev-next mode)
   */
  @Prop() hasPrev: boolean = false;

  /**
   * Whether more issues are currently loading
   */
  @Prop() isLoadingMore: boolean = false;

  /**
   * Optional callback to resolve issue URL when githubIssueLink is not available.
   * Required because repository.owner was removed from the API for privacy.
   */
  @Prop() getIssueUrl?: GetIssueUrlFn;

  /**
   * When true, each issue card uses a collapsible body (header toggles body; footer unchanged).
   */
  @Prop() collapsible: boolean = false;

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{
    issueId: string;
    upvoted: boolean;
    upvoteCount: number;
  }>;

  /**
   * Event emitted to load more issues (load-more mode)
   */
  @Event() feedlogLoadMore!: EventEmitter<void>;

  /**
   * Event emitted when navigating pages (prev-next mode)
   */
  @Event() feedlogPageChange!: EventEmitter<{ direction: 'prev' | 'next' }>;

  /**
   * Event emitted when the user clicks retry on the error state
   */
  @Event() feedlogRetry!: EventEmitter<void>;

  private handleUpvote = (event: CustomEvent) => {
    event.stopPropagation();
    this.feedlogUpvote.emit(event.detail);
  };

  private handleLoadMore = () => {
    this.feedlogLoadMore.emit();
  };

  private renderErrorIcon() {
    return (
      <svg
        class="error-state-illustration"
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="96"
        viewBox="0 0 120 96"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M36 28h48c4.4 0 8 3.6 8 8v44c0 4.4-3.6 8-8 8H36c-4.4 0-8-3.6-8-8V36c0-4.4 3.6-8 8-8z"
          fill="var(--feedlog-illustration-bg)"
          stroke="var(--feedlog-illustration-stroke)"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M28 52l16-12 16 16 16-12 16 16"
          fill="none"
          stroke="var(--feedlog-theme-bg)"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M28 52l16-12 16 16 16-12 16 16"
          fill="none"
          stroke="var(--feedlog-illustration-stroke)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="60" cy="40" r="12" fill="var(--feedlog-destructive)" opacity="0.1" />
        <path
          d="M60 36v4M60 46h.01"
          stroke="var(--feedlog-destructive)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  }

  private renderIssuesList() {
    return (
      <feedlog-issues-list
        issues={this.issues}
        theme={this.theme}
        collapsible={this.collapsible}
        getIssueUrl={this.getIssueUrl}
        emptyStateTitle={this.emptyStateTitle ?? 'Nothing to see here'}
        emptyStateMessage={
          this.emptyStateMessage ?? 'Check back later for the latest news and updates.'
        }
        onFeedlogUpvote={(e: CustomEvent) => this.handleUpvote(e)}
      />
    );
  }

  private renderSkeletonCards(count: number) {
    return (
      <div class="loading-skeletons">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} class="skeleton-card">
            <div class="skeleton-content">
              <div class="skeleton-main">
                <div class="skeleton-header">
                  <div class="skeleton-badge" />
                  <div class="skeleton-timestamp" />
                </div>
                <div class="skeleton-title" />
                <div class="skeleton-body">
                  <div class="skeleton-line" />
                  <div class="skeleton-line" />
                  <div class="skeleton-line short" />
                </div>
                <div class="skeleton-footer">
                  <div class="skeleton-footer-meta">
                    <div class="skeleton-repo" />
                  </div>
                  <div class="skeleton-upvote" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  private renderLoadMorePagination() {
    return (
      <div>
        {this.renderIssuesList()}
        {this.isLoadingMore && (
          <div class="load-more-skeletons">{this.renderSkeletonCards(this.limit ?? 3)}</div>
        )}
        {this.hasMore && !this.isLoadingMore && (
          <div class="load-more-container">
            <feedlog-button onFeedlogClick={this.handleLoadMore} variant="outline">
              {this.loadMoreLabel}
            </feedlog-button>
          </div>
        )}
      </div>
    );
  }

  private renderPrevNextPagination() {
    const showNav = this.hasPrev || this.hasMore;
    return (
      <div>
        {this.renderIssuesList()}
        {showNav && (
          <nav class="pagination" aria-label="Issues pagination">
            <button
              type="button"
              class="pagination-btn pagination-arrow"
              aria-label="Previous page"
              disabled={!this.hasPrev}
              onClick={() => this.feedlogPageChange.emit({ direction: 'prev' })}
            >
              ‹
            </button>
            <button
              type="button"
              class="pagination-btn pagination-arrow"
              aria-label="Next page"
              disabled={!this.hasMore}
              onClick={() => this.feedlogPageChange.emit({ direction: 'next' })}
            >
              ›
            </button>
          </nav>
        )}
      </div>
    );
  }

  render() {
    const containerStyle = {
      maxWidth: this.maxWidth,
    };

    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
        <div class="issues-container" style={containerStyle}>
          {(this.heading || this.subtitle) && (
            <header class="issues-header">
              <div class="header-content">
                {this.heading && <h1 class="issues-title">{this.heading}</h1>}
                {this.subtitle && <p class="issues-subtitle">{this.subtitle}</p>}
              </div>
            </header>
          )}

          {this.loading && (
            <div class="loading-state" role="status" aria-label="Loading issues">
              {this.renderSkeletonCards(3)}
            </div>
          )}

          {this.error && (
            <div class="error-state" role="alert">
              <div class="error-state-content">
                {this.renderErrorIcon()}
                <h2 class="error-state-title">Something went wrong</h2>
                <p class="error-state-message">{this.error}</p>
                <button
                  type="button"
                  class="error-retry-btn"
                  onClick={() => this.feedlogRetry.emit()}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!this.loading &&
            !this.error &&
            (this.paginationType === 'prev-next'
              ? this.renderPrevNextPagination()
              : this.renderLoadMorePagination())}
        </div>
      </Host>
    );
  }
}
