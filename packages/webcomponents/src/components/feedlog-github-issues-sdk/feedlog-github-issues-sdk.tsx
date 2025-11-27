import { Component, Prop, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { FeedlogSDK, GitHubIssue } from '@feedlog-toolkit/core';

/**
 * Feedlog GitHub Issues SDK Component
 *
 * A component for displaying GitHub issues fetched using the Feedlog SDK.
 * This component uses the SDK internally to fetch data.
 */
@Component({
  tag: 'feedlog-github-issues-sdk',
  styleUrl: 'feedlog-github-issues-sdk.css',
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
  @Prop() maxWidth: string = '56rem';

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Event emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<number>;

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
    const reposChanged = this.previousRepos !== this.repos && 
      JSON.stringify(this.previousRepos) !== JSON.stringify(this.repos);
    
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
    this.sdk.initialize({ apiKey: this.pk });
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

  render() {
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
              theme={this.theme}
              onFeedlogUpvote={this.handleUpvote}
            ></feedlog-issues-list>
          )}
        </div>
      </Host>
    );
  }
}

