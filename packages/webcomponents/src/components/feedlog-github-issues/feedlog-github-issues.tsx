import { Component, Prop, State, Event, EventEmitter, h, Host } from '@stencil/core';
import { FeedlogIssue } from '@feedlog-ai/core';

/**
 * Feedlog GitHub Issues Component
 *
 * Component for displaying GitHub issues with support for bugs and enhancements.
 * This component handles the UI rendering and delegates to feedlog-issues-list for the actual list.
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
  @Prop() issues: FeedlogIssue[] = [];

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

  private handleUpvote = (event: any) => {
    this.feedlogUpvote.emit(event.detail);
  };

  private handleLoadMore = () => {
    this.feedlogLoadMore.emit();
  };

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
            <div class="loading-state">
              <p>Loading issues...</p>
            </div>
          )}

          {this.error && (
            <div class="error-state">
              <p>Error: {this.error}</p>
            </div>
          )}

          {!this.loading && !this.error && (
            <div>
              <feedlog-issues-list
                issues={this.issues}
                theme={this.currentTheme}
                onFeedlogUpvote={this.handleUpvote}
              ></feedlog-issues-list>

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
