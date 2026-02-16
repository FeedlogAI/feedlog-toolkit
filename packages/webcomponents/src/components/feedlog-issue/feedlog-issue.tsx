import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType } from '@feedlog-ai/core';
import { parseMarkdown } from '../../utils/markdown';

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
   * Renders the pin icon SVG (Lucide/Feather style)
   */
  private renderPinIcon() {
    return (
      <svg
        class="pin-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 17v5" />
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2h1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
      </svg>
    );
  }

  /**
   * Renders the upvote (thumbs-up) icon SVG
   */
  private renderUpvoteIcon(filled: boolean) {
    if (filled) {
      return (
        <svg
          class="upvote-icon filled"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
      );
    }
    return (
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
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    );
  }

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

    const wasUpdated = new Date(issue.updatedAt).getTime() > new Date(issue.createdAt).getTime();
    const timestampLabel = wasUpdated ? 'Updated' : 'Created';
    const timestampDate = wasUpdated ? issue.updatedAt : issue.createdAt;
    const timestampTitle = wasUpdated
      ? `Updated: ${issue.updatedAt}`
      : `Created: ${issue.createdAt}`;

    return (
      <Host
        class={this.theme === 'dark' ? 'dark' : ''}
        data-upvoted={issue.hasUpvoted ? 'true' : 'false'}
      >
        <div class={`issue-card issue-type-${issue.type}`}>
          <div class="issue-content">
            <div class="issue-header">
              <div class="issue-header-left">
                <div class="issue-type-badge">
                  {issue.type === 'bug' ? (
                    <feedlog-badge variant="destructive">Bug</feedlog-badge>
                  ) : (
                    <feedlog-badge variant="enhancement">Enhancement</feedlog-badge>
                  )}
                </div>
                {issue.pinnedAt && (
                  <div class="pinned-indicator" title="Pinned issue">
                    {this.renderPinIcon()}
                  </div>
                )}
              </div>
              <span class="issue-timestamp" title={timestampTitle}>
                {timestampLabel} {this.formatDate(timestampDate)}
              </span>
            </div>

            <div class="issue-main">
              <div class="issue-details">
                <h3 class="issue-title">{issue.title}</h3>
                <div class="issue-body" innerHTML={parseMarkdown(issue.body)} />

                <div class="issue-repository">
                  <span class="repo-name">
                    {issue.repository.owner}/{issue.repository.name}
                  </span>
                </div>
              </div>

              {issue.type !== 'bug' && (
                <button
                  part="upvote-button"
                  class={`upvote-button ${issue.hasUpvoted ? 'upvoted' : ''}`}
                  onClick={(e: MouseEvent) => this.handleUpvote(e)}
                  title={issue.hasUpvoted ? 'Remove upvote' : 'Upvote this issue'}
                >
                  <slot name="upvote-icon">{this.renderUpvoteIcon(issue.hasUpvoted)}</slot>
                  <span class="upvote-count">{issue.upvoteCount}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
