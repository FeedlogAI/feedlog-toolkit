import { Component, Prop, State, Event, EventEmitter, h, Host } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType, GetIssueUrlFn } from '@feedlog-ai/core';

/**
 * Feedlog GitHub Issues Component
 *
 * Component for displaying GitHub issues with support for bugs and enhancements.
 * Includes full list rendering, loading/error states, and pagination support.
 */
@Component({
  tag: 'feedlog-github-issues',
  styleUrl: 'feedlog-github-issues.css',
  shadow: true,
})
export class FeedlogGithubIssues {
  /**
   * Array of issues to display
   */
  @Prop() issues: FeedlogIssueType[] = [];

  /**
   * Maximum width of the container
   */
  @Prop() maxWidth: string = '42rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop({ mutable: true }) theme: 'light' | 'dark' = 'light';

  /**
   * Custom heading for the issues section
   */
  @Prop() heading?: string;

  /**
   * Custom subtitle for the issues section
   */
  @Prop() subtitle?: string;

  /**
   * Empty state title. Defaults to "No updates yet".
   */
  @Prop() emptyStateTitle?: string;

  /**
   * Empty state message. Defaults to "Check back later for new updates.".
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
   * Whether there are more issues to load
   */
  @Prop() hasMore: boolean = false;

  /**
   * Whether more issues are currently loading
   */
  @Prop() isLoadingMore: boolean = false;

  /**
   * Optional callback to resolve GitHub issue URL when githubIssueLink is not available.
   * Required because repository.owner was removed from the API for privacy.
   */
  @Prop() getIssueUrl?: GetIssueUrlFn;

  /**
   * Internal state for theme
   */
  @State() currentTheme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{
    issueId: string;
    currentUpvoted: boolean;
    currentCount: number;
  }>;

  /**
   * Event emitted to load more issues
   */
  @Event() feedlogLoadMore!: EventEmitter<void>;

  componentWillLoad() {
    this.currentTheme = this.theme;
  }

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
        class="error-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }

  private renderIssuesList() {
    return (
      <feedlog-issues-list
        issues={this.issues}
        theme={this.currentTheme}
        getIssueUrl={this.getIssueUrl}
        emptyStateTitle={this.emptyStateTitle ?? 'No updates yet'}
        emptyStateMessage={this.emptyStateMessage ?? 'Check back later for new updates.'}
        onFeedlogUpvote={(e: CustomEvent) => this.handleUpvote(e)}
      />
    );
  }

  render() {
    const containerStyle = {
      maxWidth: this.maxWidth,
    };

    return (
      <Host class={this.currentTheme === 'dark' ? 'dark' : ''}>
        <div class="github-issues-container" style={containerStyle}>
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
              <div class="loading-skeletons">
                {[1, 2, 3].map(i => (
                  <div key={i} class="skeleton-card">
                    <div class="skeleton-content">
                      <div class="skeleton-header">
                        <div class="skeleton-badge" />
                        <div class="skeleton-timestamp" />
                      </div>
                      <div class="skeleton-main">
                        <div class="skeleton-title" />
                        <div class="skeleton-body">
                          <div class="skeleton-line" />
                          <div class="skeleton-line short" />
                        </div>
                        <div class="skeleton-repo" />
                      </div>
                      <div class="skeleton-footer">
                        <div class="skeleton-upvote" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {this.error && (
            <div class="error-state" role="alert">
              <div class="error-state-content">
                {this.renderErrorIcon()}
                <h2 class="error-state-title">Something went wrong</h2>
                <p class="error-state-message">{this.error}</p>
              </div>
            </div>
          )}

          {!this.loading && !this.error && (
            <div>
              {this.renderIssuesList()}

              {this.hasMore && (
                <div class="load-more-container">
                  <feedlog-button
                    onFeedlogClick={this.handleLoadMore}
                    disabled={this.isLoadingMore}
                    variant="outline"
                  >
                    {this.isLoadingMore ? 'Loading...' : 'Load More Issues'}
                  </feedlog-button>
                </div>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
