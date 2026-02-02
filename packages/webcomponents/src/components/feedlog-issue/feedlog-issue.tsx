import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType } from '@feedlog-ai/core';

/**
 * Heart icon SVG component (filled)
 */
const HeartFilledIcon = () => (
  <svg
    class="upvote-icon filled"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

/**
 * Heart icon SVG component (outline)
 */
const HeartOutlineIcon = () => (
  <svg
    class="upvote-icon outline"
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

/**
 * Feedlog Issue Component
 *
 * A component for displaying a single GitHub issue.
 */
@Component({
  tag: 'feedlog-issue',
  styleUrl: 'feedlog-issue.css',
  shadow: true,
})
export class FeedlogIssueComponent {
  /**
   * The issue to display
   */
  @Prop() issue!: FeedlogIssueType;

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when the issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{
    issueId: string;
    currentUpvoted: boolean;
    currentCount: number;
  }>;

  private handleUpvote = (event: MouseEvent) => {
    event.stopPropagation();
    this.feedlogUpvote.emit({
      issueId: this.issue.id,
      currentUpvoted: this.issue.hasUpvoted,
      currentCount: this.issue.upvoteCount,
    });
  };

  /**
   * Format an ISO date string to a relative time string
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return 'just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

      return date.toLocaleDateString();
    } catch {
      return 'unknown date';
    }
  }

  render() {
    const { issue } = this;
    if (!issue) return null;

    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
        <div class="issue-card">
          <div class="issue-content">
            <div class="issue-header">
              <div class="issue-type-badge">
                {issue.type === 'bug' ? (
                  <feedlog-badge variant="destructive">Bug</feedlog-badge>
                ) : (
                  <feedlog-badge variant="enhancement">Enhancement</feedlog-badge>
                )}
              </div>
              {issue.pinnedAt && (
                <div class="pinned-indicator" title="Pinned issue">
                  📌
                </div>
              )}
            </div>

            <div class="issue-main">
              <div class="issue-details">
                <h3 class="issue-title">{issue.title}</h3>
                <p class="issue-body">{issue.body}</p>

                <div class="issue-repository">
                  <span class="repo-name">
                    {issue.repository.owner}/{issue.repository.name}
                  </span>
                </div>
              </div>

              {issue.type !== 'bug' && (
                <button
                  class={`upvote-button ${issue.hasUpvoted ? 'upvoted' : ''}`}
                  onClick={(e: MouseEvent) => this.handleUpvote(e)}
                  title={issue.hasUpvoted ? 'Remove upvote' : 'Upvote this issue'}
                >
                  {issue.hasUpvoted ? HeartFilledIcon() : HeartOutlineIcon()}
                  <span class="upvote-count">{issue.upvoteCount}</span>
                </button>
              )}
            </div>

            <div class="issue-footer">
              <span class="issue-date" title={`Updated: ${issue.updatedAt}`}>
                Updated {this.formatDate(issue.updatedAt)}
              </span>
              <span class="issue-date" title={`Created: ${issue.createdAt}`}>
                Created {this.formatDate(issue.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
