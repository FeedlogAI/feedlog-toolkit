import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  type: 'bug' | 'enhancement';
  upvotes?: number;
}

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
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  private handleUpvote = (event: CustomEvent, issueId: number) => {
    event.stopPropagation();
    this.feedlogUpvote.emit(issueId);
  };

  private renderBugIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="bug-icon"
      >
        <path d="m8 2 1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-4a6 6 0 0 1 12 0v4c0 3.3-2.7 6-6 6Z" />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" />
        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        <path d="M12 12l1.88-1.88" />
        <path d="M12 12l-1.88-1.88" />
      </svg>
    );
  }

  private renderThumbsUpIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="thumbs-up-icon"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    );
  }

  render() {
    return (
      <div class="issues-list">
        {this.issues.map(issue => (
          <feedlog-card key={issue.id} class="issue-card">
            <div slot="header" class="issue-header">
              <div class="issue-content-wrapper">
                {issue.type === 'enhancement' && (
                  <feedlog-button
                    variant="outline"
                    size="sm"
                    class="upvote-button"
                    onFeedlogClick={(e: CustomEvent) => this.handleUpvote(e, issue.id)}
                  >
                    {this.renderThumbsUpIcon()}
                    <span class="upvote-count">{issue.upvotes || 0}</span>
                  </feedlog-button>
                )}
                {issue.type === 'bug' && <div class="bug-icon-wrapper">{this.renderBugIcon()}</div>}
                <div class="issue-details">
                  <div class="issue-title-row">
                    <h3 class="issue-title">{issue.title}</h3>
                    {issue.type === 'bug' ? (
                      <feedlog-badge variant="destructive">Bug</feedlog-badge>
                    ) : (
                      <feedlog-badge>Enhancement</feedlog-badge>
                    )}
                  </div>
                  <p class="issue-body">{issue.body}</p>
                </div>
              </div>
            </div>
          </feedlog-card>
        ))}
      </div>
    );
  }
}
