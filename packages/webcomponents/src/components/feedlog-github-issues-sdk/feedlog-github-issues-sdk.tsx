import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { FeedlogSDK, GitHubIssue } from '@feedlog-toolkit/core';

/**
 * Feedlog GitHub Issues SDK Component
 *
 * A component for displaying GitHub issues fetched using the Feedlog SDK.
 * This component uses the SDK internally to fetch data and delegates to the base component for rendering.
 */
@Component({
  tag: 'feedlog-github-issues-sdk',
  shadow: true,
})
export class FeedlogGithubIssuesSdk {
  /**
   * API key (public key) for the Feedlog SDK
   */
  @Prop() pk!: string;

  /**
   * Array of repository IDs (e.g., ['owner/repo']) or JSON string
   */
  @Prop() repos?: string[] | string;

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

  @State() issues: GitHubIssue[] = [];
  @State() loading: boolean = true;
  @State() error: string | null = null;

  private sdk: FeedlogSDK | null = null;
  private previousPk?: string;
  private previousRepos?: string[] | string;

  componentWillLoad() {
    this.previousPk = this.pk;
    this.previousRepos = this.repos;
    this.initializeSDK();
    this.fetchIssues();
  }

  componentDidUpdate() {
    // Re-fetch if pk or repos changed
    const pkChanged = this.previousPk !== this.pk;
    const reposChanged = JSON.stringify(this.previousRepos) !== JSON.stringify(this.repos);

    if (pkChanged || reposChanged) {
      if (pkChanged) {
        this.initializeSDK();
      }
      this.fetchIssues();
      this.previousPk = this.pk;
      this.previousRepos = this.repos;
    }
  }

  private initializeSDK() {
    if (!this.pk) {
      this.error = 'API key (pk) is required';
      this.loading = false;
      return;
    }

    this.sdk = new FeedlogSDK(this.pk);
  }

  private parseRepos(): string[] {
    if (!this.repos) {
      return [];
    }

    if (typeof this.repos === 'string') {
      try {
        const parsed = JSON.parse(this.repos);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If not valid JSON, treat as single repo string
        return [this.repos];
      }
    }

    return Array.isArray(this.repos) ? this.repos : [];
  }

  private async fetchIssues() {
    if (!this.sdk) {
      return;
    }

    const repos = this.parseRepos();

    if (repos.length === 0) {
      this.error = 'At least one repository is required';
      this.loading = false;
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      this.issues = await this.sdk.fetchIssues(repos);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to fetch issues';
      this.issues = [];
    } finally {
      this.loading = false;
    }
  }

  private handleUpvote = (event: CustomEvent<number>) => {
    this.feedlogUpvote.emit(event.detail);
  };

  private handleThemeChange = (event: CustomEvent<'light' | 'dark'>) => {
    this.feedlogThemeChange.emit(event.detail);
  };

  render() {
    return (
      <feedlog-github-issues-base
        issues={this.issues}
        maxWidth={this.maxWidth}
        theme={this.theme}
        showThemeToggle={this.showThemeToggle}
        loading={this.loading}
        error={this.error}
        onFeedlogUpvote={this.handleUpvote}
        onFeedlogThemeChange={this.handleThemeChange}
      ></feedlog-github-issues-base>
    );
  }
}
