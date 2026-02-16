import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType } from '@feedlog-ai/core';

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
   * Emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{
    issueId: string;
    currentUpvoted: boolean;
    currentCount: number;
  }>;

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
              <p>No issues found</p>
            </div>
          ) : (
            this.issues.map(issue => (
              <feedlog-issue
                key={issue.id}
                issue={issue}
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
