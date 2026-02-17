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

  /**
   * Event emitted when user clicks retry in error state
   */
  @Event() feedlogRetry!: EventEmitter<void>;

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

  private handleRetry = () => {
    this.feedlogRetry.emit();
  };

  private renderEmptyStateIllustration() {
    return (
      <svg
        class="empty-state-illustration"
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="96"
        viewBox="0 0 120 96"
        fill="none"
        aria-hidden="true"
      >
        {/* Inbox tray base */}
        <path
          d="M20 36h80v44c0 4.4-3.6 8-8 8H28c-4.4 0-8-3.6-8-8V36z"
          fill="var(--feedlog-empty-illustration-bg)"
          stroke="var(--feedlog-empty-illustration-stroke)"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        {/* Inbox opening */}
        <path
          d="M20 36l20-24h40l20 24"
          fill="none"
          stroke="var(--feedlog-empty-illustration-stroke)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        {/* Document/list icon inside */}
        <path
          d="M44 52h32M44 60h24M44 68h28"
          stroke="var(--feedlog-empty-illustration-muted)"
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    );
  }

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
      <div class="issues-list">
        {this.issues.length === 0 ? (
          <div class="empty-state">
            <div class="empty-state-content">
              {this.renderEmptyStateIllustration()}
              <h2 class="empty-state-title">{this.emptyStateTitle ?? 'No updates yet'}</h2>
              <p class="empty-state-message">
                {this.emptyStateMessage ?? 'Check back later for new updates.'}
              </p>
            </div>
          </div>
        ) : (
          this.issues.map(issue => (
            <feedlog-issue
              key={issue.id}
              issue={issue}
              issueUrl={this.getIssueUrl?.(issue) ?? undefined}
              theme={this.currentTheme}
              onFeedlogUpvote={(e: CustomEvent) => this.handleUpvote(e)}
            />
          ))
        )}
      </div>
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
                <feedlog-button variant="outline" onFeedlogClick={this.handleRetry}>
                  Try again
                </feedlog-button>
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
