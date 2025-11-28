import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { GitHubIssue } from '@feedlog-toolkit/core';

/**
 * Feedlog GitHub Issues Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 * This component accepts data directly and delegates to the base component for rendering.
 */
@Component({
  tag: 'feedlog-github-issues',
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
  @Prop() maxWidth: string = '42rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Whether to show the theme toggle button
   */
  @Prop() showThemeToggle: boolean = true;

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  /**
   * Event emitted when theme changes
   */
  @Event() feedlogThemeChange!: EventEmitter<'light' | 'dark'>;

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

  private handleThemeChange = (event: CustomEvent<'light' | 'dark'>) => {
    this.feedlogThemeChange.emit(event.detail);
  };

  render() {
    const issues = this.parseData();

    return (
      <feedlog-github-issues-base
        issues={issues}
        maxWidth={this.maxWidth}
        theme={this.theme}
        showThemeToggle={this.showThemeToggle}
        loading={false}
        error={null}
        onFeedlogUpvote={this.handleUpvote}
        onFeedlogThemeChange={this.handleThemeChange}
      ></feedlog-github-issues-base>
    );
  }
}
