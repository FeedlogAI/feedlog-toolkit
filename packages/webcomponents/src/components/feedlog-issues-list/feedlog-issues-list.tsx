import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType, GetIssueUrlFn } from '@feedlog-ai/core';

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
  @Prop() issues: FeedlogIssueType[] = [];

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Optional callback to resolve GitHub issue URL when githubIssueLink is not available.
   */
  @Prop() getIssueUrl?: GetIssueUrlFn;

  /**
   * Empty state title. When provided with emptyStateMessage, shows a richer empty state with illustration.
   */
  @Prop() emptyStateTitle?: string;

  /**
   * Empty state message. When provided with emptyStateTitle, shows a richer empty state with illustration.
   */
  @Prop() emptyStateMessage?: string;

  /**
   * Emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{
    issueId: string;
    currentUpvoted: boolean;
    currentCount: number;
  }>;

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
        <path
          d="M20 36h80v44c0 4.4-3.6 8-8 8H28c-4.4 0-8-3.6-8-8V36z"
          fill="var(--feedlog-empty-illustration-bg)"
          stroke="var(--feedlog-empty-illustration-stroke)"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M20 36l20-24h40l20 24"
          fill="none"
          stroke="var(--feedlog-empty-illustration-stroke)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M44 52h32M44 60h24M44 68h28"
          stroke="var(--feedlog-empty-illustration-muted)"
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    );
  }

  private handleUpvote = (
    event: CustomEvent<{
      issueId: string;
      currentUpvoted: boolean;
      currentCount: number;
    }>
  ) => {
    event.stopPropagation();
    this.feedlogUpvote.emit(event.detail);
  };

  render() {
    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
        <div class="issues-list">
          {this.issues.length === 0 ? (
            <div class="empty-state">
              {this.emptyStateTitle && this.emptyStateMessage ? (
                <div class="empty-state-content">
                  {this.renderEmptyStateIllustration()}
                  <h2 class="empty-state-title">{this.emptyStateTitle}</h2>
                  <p class="empty-state-message">{this.emptyStateMessage}</p>
                </div>
              ) : (
                <p>No issues found</p>
              )}
            </div>
          ) : (
            this.issues.map(issue => (
              <feedlog-issue
                key={issue.id}
                issue={issue}
                issueUrl={this.getIssueUrl?.(issue) ?? undefined}
                theme={this.theme}
                onFeedlogUpvote={(e: CustomEvent) => this.handleUpvote(e)}
              />
            ))
          )}
        </div>
      </Host>
    );
  }
}
