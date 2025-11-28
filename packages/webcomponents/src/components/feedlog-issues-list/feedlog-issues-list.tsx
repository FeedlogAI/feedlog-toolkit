import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  type: 'bug' | 'enhancement';
  upvotes?: number;
  postedAt?: string;
}

/**
 * TrendingUp icon SVG component
 */
const TrendingUpIcon = () => (
  <svg
    class="upvote-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);

/**
 * Feedlog Issues List Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 */
@Component({
  tag: 'feedlog-issues-list',
  styleUrl: 'feedlog-issues-list.css',
  shadow: true,
})
export class FeedlogIssuesList {
  /**
   * Array of issues to display
   */
  @Prop() issues: GitHubIssue[] = [];

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  private handleUpvote = (event: MouseEvent, issueId: number) => {
    event.stopPropagation();
    this.feedlogUpvote.emit(issueId);
  };

  render() {
    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
        <div class="issues-list">
          {this.issues.map(issue => (
            <div key={issue.id} class="issue-card">
              <div class="issue-content">
                <div class="issue-main">
                  <div class="issue-details">
                    <h3 class="issue-title">{issue.title}</h3>
                    <p class="issue-body">{issue.body}</p>
                    <div class="issue-badge">
                      {issue.type === 'bug' ? (
                        <feedlog-badge variant="destructive">Bug</feedlog-badge>
                      ) : (
                        <feedlog-badge variant="enhancement">Enhancement</feedlog-badge>
                      )}
                    </div>
                  </div>
                  {issue.type === 'enhancement' && (
                    <button
                      class="upvote-button"
                      onClick={(e: MouseEvent) => this.handleUpvote(e, issue.id)}
                    >
                      <TrendingUpIcon />
                      <span class="upvote-count">{issue.upvotes || 0}</span>
                    </button>
                  )}
                </div>
                {issue.postedAt && (
                  <span class="posted-at">Posted {issue.postedAt}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
