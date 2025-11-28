import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';
import { GitHubIssue } from '@feedlog-toolkit/core';

/**
 * Feedlog GitHub Issues Base Component
 *
 * Shared base component for displaying GitHub issues with support for bugs and enhancements.
 * This component handles the UI rendering and delegates to feedlog-issues-list for the actual list.
 */
@Component({
  tag: 'feedlog-github-issues-base',
  styleUrl: 'feedlog-github-issues-base.css',
  shadow: true,
})
export class FeedlogGithubIssuesBase {
  /**
   * Array of issues to display
   */
  @Prop() issues: GitHubIssue[] = [];

  /**
   * Maximum width of the container
   */
  @Prop() maxWidth: string = '56rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Loading state - shows loading indicator when true
   */
  @Prop() loading: boolean = false;

  /**
   * Error message - shows error state when set
   */
  @Prop() error: string | null = null;

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  private handleUpvote = (event: CustomEvent<number>) => {
    this.feedlogUpvote.emit(event.detail);
  };

  render() {
    const containerStyle = {
      maxWidth: this.maxWidth,
    };

    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
        <div class="github-issues-container" style={containerStyle}>
          <header class="issues-header">
            <h1 class="issues-title">GitHub Issues</h1>
            <p class="issues-subtitle">Track bugs and enhancements for your project</p>
          </header>

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
            <feedlog-issues-list
              issues={this.issues}
              theme={this.theme}
              onFeedlogUpvote={this.handleUpvote}
            ></feedlog-issues-list>
          )}
        </div>
      </Host>
    );
  }
}

