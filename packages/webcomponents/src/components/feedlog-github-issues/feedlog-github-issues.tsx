import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  type: 'bug' | 'enhancement';
  upvotes?: number;
}

/**
 * Feedlog GitHub Issues Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 */
@Component({
  tag: 'feedlog-github-issues',
  styleUrl: 'feedlog-github-issues.css',
  shadow: true,
})
export class FeedlogGithubIssues {
  /**
   * Issues data as JSON string or array
   */
  @Prop() data?: string | GitHubIssue[];

  /**
   * Maximum width of the container
   */
  @Prop() maxWidth: string = '56rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  private parseData(): GitHubIssue[] {
    if (!this.data) {
      return [];
    }

    if (typeof this.data === 'string') {
      try {
        return JSON.parse(this.data);
      } catch {
        return [];
      }
    }

    return Array.isArray(this.data) ? this.data : [];
  }

  private handleUpvote = (event: CustomEvent<number>) => {
    this.feedlogUpvote.emit(event.detail);
  };

  render() {
    const issues = this.parseData();
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

          <feedlog-issues-list
            issues={issues}
            theme={this.theme}
            onFeedlogUpvote={this.handleUpvote}
          ></feedlog-issues-list>
        </div>
      </Host>
    );
  }
}
