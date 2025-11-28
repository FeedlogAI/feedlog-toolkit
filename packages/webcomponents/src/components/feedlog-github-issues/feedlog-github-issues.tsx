import { Component, Prop, State, Event, EventEmitter, h, Host } from '@stencil/core';
import { GitHubIssue } from '@feedlog-toolkit/core';

/**
 * Sun icon SVG component
 */
const SunIcon = () => (
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
  >
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.41 1.41"></path>
    <path d="m17.66 17.66 1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.34 17.66-1.41 1.41"></path>
    <path d="m19.07 4.93-1.41 1.41"></path>
  </svg>
);

/**
 * Moon icon SVG component
 */
const MoonIcon = () => (
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
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

/**
 * Feedlog GitHub Issues Component
 *
 * Component for displaying GitHub issues with support for bugs and enhancements.
 * This component handles the UI rendering and delegates to feedlog-issues-list for the actual list.
 */
@Component({
  tag: 'feedlog-github-issues',
  styleUrl: 'feedlog-github-issues.css',
  shadow: true,
})
export class FeedlogGithubIssues {
  /**
   * Array of issues to display
   */
  @Prop() issues: GitHubIssue[] = [];

  /**
   * Maximum width of the container
   */
  @Prop() maxWidth: string = '42rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop({ mutable: true }) theme: 'light' | 'dark' = 'light';

  /**
   * Loading state - shows loading indicator when true
   */
  @Prop() loading: boolean = false;

  /**
   * Error message - shows error state when set
   */
  @Prop() error: string | null = null;

  /**
   * Whether to show the theme toggle button
   */
  @Prop() showThemeToggle: boolean = true;

  /**
   * Internal state for theme
   */
  @State() currentTheme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

  /**
   * Event emitted when theme changes
   */
  @Event() feedlogThemeChange!: EventEmitter<'light' | 'dark'>;

  componentWillLoad() {
    this.currentTheme = this.theme;
  }

  private handleUpvote = (event: CustomEvent<number>) => {
    this.feedlogUpvote.emit(event.detail);
  };

  private toggleTheme = () => {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.theme = this.currentTheme;
    this.feedlogThemeChange.emit(this.currentTheme);
  };

  render() {
    const containerStyle = {
      maxWidth: this.maxWidth,
    };

    return (
      <Host class={this.currentTheme === 'dark' ? 'dark' : ''}>
        <div class="github-issues-container" style={containerStyle}>
          <header class="issues-header">
            <div class="header-content">
              <h1 class="issues-title">GitHub Issues</h1>
              <p class="issues-subtitle">Track bugs and enhancements for your project</p>
            </div>
            {this.showThemeToggle && (
              <feedlog-button variant="outline" size="sm" onFeedlogClick={this.toggleTheme}>
                {this.currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </feedlog-button>
            )}
          </header>

          {this.loading && (
            <div class="loading-state">
              <p>Loading issues...</p>
            </div>
          )}

          {this.error && (
            <div class="error-state">
              <p>Error: {this.error}</p>
            </div>
          )}

          {!this.loading && !this.error && (
            <feedlog-issues-list
              issues={this.issues}
              theme={this.currentTheme}
              onFeedlogUpvote={this.handleUpvote}
            ></feedlog-issues-list>
          )}
        </div>
      </Host>
    );
  }
}
