import { Component, Prop, Event, EventEmitter, h, Host, Element } from '@stencil/core';
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
  @Element() host!: HTMLElement;
  /**
   * The issue to display
   */
  @Prop() issue!: FeedlogIssueType;

  /**
   * Optional URL for the GitHub issue. When provided along with githubIssueLink,
   * shows a "View on GitHub" button. Required because owner is no longer in the API response.
   */
  @Prop() issueUrl?: string | null;

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

  componentDidLoad() {
    const mediaSlot = this.host.shadowRoot?.querySelector('slot[name="media"]');
    if (mediaSlot) {
      mediaSlot.addEventListener('slotchange', this.handleMediaSlotChange);
      this.updateMediaVisibility();
    }
  }

  disconnectedCallback() {
    const mediaSlot = this.host.shadowRoot?.querySelector('slot[name="media"]');
    if (mediaSlot) {
      mediaSlot.removeEventListener('slotchange', this.handleMediaSlotChange);
    }
  }

  private handleMediaSlotChange = () => {
    this.updateMediaVisibility();
  };

  private updateMediaVisibility() {
    const mediaEl = this.host.shadowRoot?.querySelector('.issue-media');
    if (!mediaEl) return;
    const slot = this.host.querySelector('[slot="media"]');
    mediaEl.classList.toggle('has-media', !!slot);
  }

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
   * Renders the upvote (caret-up / arrow) icon SVG
   * Path centered in 24x24 viewBox for proper vertical alignment
   */
  private renderUpvoteIcon(filled: boolean) {
    const path = 'M12 7l7 10H5l7-10z';
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
          <path d={path} />
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
        <path d={path} />
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

  /**
   * Get the status badge label for closed issues
   */
  private getStatusBadgeLabel(): string | null {
    const { issue } = this;
    if (issue.status === 'in_progress') return 'In progress';
    if (issue.status === 'closed' && issue.type === 'bug') return 'Resolved';
    if (issue.status === 'closed' && issue.type === 'enhancement') return 'Implemented';
    return null;
  }

  /**
   * Renders the external link (GitHub) icon SVG
   */
  private renderExternalLinkIcon() {
    return (
      <svg
        class="github-link-icon"
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
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  }

  render() {
    const { issue, issueUrl } = this;
    if (!issue) return null;

    const wasUpdated = new Date(issue.updatedAt).getTime() > new Date(issue.createdAt).getTime();
    const timestampLabel = wasUpdated ? 'Updated' : 'Created';
    const timestampDate = wasUpdated ? issue.updatedAt : issue.createdAt;
    const timestampTitle = wasUpdated
      ? `Updated: ${issue.updatedAt}`
      : `Created: ${issue.createdAt}`;

    const displayTitle = issue.title ?? 'Untitled';
    const rawRepoName = issue.repository.name;
    const repoName =
      rawRepoName != null &&
      rawRepoName !== '' &&
      rawRepoName.toLowerCase() !== 'unnamed repository'
        ? rawRepoName
        : null;
    const repoTooltip =
      issue.repository.description != null && issue.repository.description !== ''
        ? issue.repository.description
        : undefined;
    const statusBadgeLabel = this.getStatusBadgeLabel();
    const githubUrl = issue.githubIssueLink ?? issueUrl;
    const showGithubButton = githubUrl != null && githubUrl !== '';

    return (
      <Host
        class={this.theme === 'dark' ? 'dark' : ''}
        data-upvoted={issue.hasUpvoted ? 'true' : 'false'}
      >
        <div class={`issue-card issue-type-${issue.type}`}>
          <div class="issue-media" part="media">
            <slot name="media" />
          </div>
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
                {statusBadgeLabel && (
                  <feedlog-badge variant="secondary">{statusBadgeLabel}</feedlog-badge>
                )}
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
              <h3 class="issue-title">{displayTitle}</h3>
              {issue.body != null && issue.body !== '' && (
                <div class="issue-body" innerHTML={parseMarkdown(issue.body)} />
              )}

              {(repoName != null || showGithubButton || issue.type !== 'bug') && (
                <div class="issue-footer">
                  {(repoName != null || showGithubButton) && (
                    <div class="issue-footer-meta">
                      {repoName != null && (
                        <span class="repo-name" title={repoTooltip}>
                          {repoName}
                        </span>
                      )}
                      {showGithubButton && (
                        <a
                          part="github-link"
                          class="github-link"
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on GitHub"
                        >
                          {this.renderExternalLinkIcon()}
                          <span class="github-link-text">View on GitHub</span>
                        </a>
                      )}
                    </div>
                  )}
                  {issue.type !== 'bug' && (
                    <button
                      part="upvote-button"
                      class={`upvote-button ${issue.hasUpvoted ? 'upvoted' : ''}`}
                      onClick={(e: MouseEvent) => this.handleUpvote(e)}
                      title={issue.hasUpvoted ? 'Remove upvote' : 'Upvote this issue'}
                    >
                      <div class="upvote-action">
                        <slot name="upvote-icon">{this.renderUpvoteIcon(issue.hasUpvoted)}</slot>
                        <span class="upvote-label">Upvote</span>
                      </div>
                      <div class="reel-container">
                        <span class="upvote-count reel-number" key={issue.upvoteCount}>
                          {issue.upvoteCount}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
