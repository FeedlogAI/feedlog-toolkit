import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';

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
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  private handleUpvote = (event: CustomEvent, issueId: number) => {
    event.stopPropagation();
    this.feedlogUpvote.emit(issueId);
  };

  render() {
    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
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
                      <span class="upvote-count">{issue.upvotes || 0}</span>
                    </feedlog-button>
                  )}
                  <div class="issue-details">
                    <div class="issue-title-row">
                      <h3 class="issue-title">{issue.title}</h3>
                    </div>
                    <p class="issue-body">{issue.body}</p>
                  </div>
                </div>
              </div>
              <div slot="footer" class="issue-footer">
                {issue.type === 'bug' ? (
                  <feedlog-badge variant="destructive">Bug</feedlog-badge>
                ) : (
                  <feedlog-badge>Enhancement</feedlog-badge>
                )}
              </div>
            </feedlog-card>
          ))}
        </div>
      </Host>
    );
  }
}
