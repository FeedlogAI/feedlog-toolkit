import { h } from '@stencil/core';
import { FeedlogSDK } from '@feedlog-toolkit/core';
/**
 * Feedlog GitHub Issues Client Component
 *
 * A component for displaying GitHub issues fetched using the Feedlog SDK.
 * This component uses the SDK internally to fetch data and delegates to feedlog-github-issues for rendering.
 */
export class FeedlogGithubIssuesClient {
  constructor() {
    /**
     * Maximum width of the container
     */
    this.maxWidth = '42rem';
    /**
     * Theme variant: 'light' or 'dark'
     */
    this.theme = 'light';
    /**
     * Whether to show the theme toggle button
     */
    this.showThemeToggle = true;
    this.issues = [];
    this.loading = true;
    this.error = null;
    this.cursor = null;
    this.hasMore = false;
    this.isLoadingMore = false;
    this.sdk = null;
    this.handleUpvote = async event => {
      if (!this.sdk) {
        return;
      }
      const { issueId, currentUpvoted, currentCount } = event.detail;
      // Optimistic update
      this.issues = this.issues.map(issue =>
        issue.id === issueId
          ? Object.assign(Object.assign({}, issue), {
              hasUpvoted: !currentUpvoted,
              upvoteCount: currentUpvoted ? currentCount - 1 : currentCount + 1,
            })
          : issue
      );
      try {
        const result = await this.sdk.toggleUpvote(issueId);
        // Update with server response
        this.issues = this.issues.map(issue =>
          issue.id === issueId
            ? Object.assign(Object.assign({}, issue), {
                hasUpvoted: result.upvoted,
                upvoteCount: result.upvoteCount,
              })
            : issue
        );
        this.feedlogUpvote.emit({
          issueId,
          upvoted: result.upvoted,
          upvoteCount: result.upvoteCount,
        });
      } catch (err) {
        // Revert optimistic update on error
        this.issues = this.issues.map(issue =>
          issue.id === issueId
            ? Object.assign(Object.assign({}, issue), {
                hasUpvoted: currentUpvoted,
                upvoteCount: currentCount,
              })
            : issue
        );
        const errorMsg = err instanceof Error ? err.message : 'Failed to toggle upvote';
        this.feedlogError.emit({ error: errorMsg });
      }
    };
    this.handleThemeChange = event => {
      this.theme = event.detail;
      this.feedlogThemeChange.emit(event.detail);
    };
  }
  componentWillLoad() {
    this.previousRepos = this.repos;
    this.previousType = this.type;
    this.previousLimit = this.limit;
    this.initializeSDK();
    this.fetchIssues();
  }
  componentDidUpdate() {
    // Re-fetch if any props changed
    const reposChanged = JSON.stringify(this.previousRepos) !== JSON.stringify(this.repos);
    const typeChanged = this.previousType !== this.type;
    const limitChanged = this.previousLimit !== this.limit;
    if (reposChanged || typeChanged || limitChanged) {
      // Reset pagination when filters change
      this.cursor = null;
      this.hasMore = false;
      this.issues = [];
      this.fetchIssues();
      this.previousRepos = this.repos;
      this.previousType = this.type;
      this.previousLimit = this.limit;
    }
  }
  initializeSDK() {
    try {
      this.sdk = new FeedlogSDK(Object.assign({}, this.endpoint && { endpoint: this.endpoint }));
      this.error = null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize SDK';
      this.error = errorMsg;
      this.feedlogError.emit({ error: errorMsg });
    }
  }
  parseRepos() {
    if (!this.repos) {
      return [];
    }
    if (typeof this.repos === 'string') {
      try {
        const parsed = JSON.parse(this.repos);
        return Array.isArray(parsed) ? parsed : [this.repos];
      } catch (_a) {
        // If not valid JSON, treat as single repo ID
        return [this.repos];
      }
    }
    return Array.isArray(this.repos) ? this.repos : [];
  }
  async fetchIssues() {
    if (!this.sdk) {
      return;
    }
    const repos = this.parseRepos();
    if (repos.length === 0) {
      this.error = 'At least one repository is required';
      this.loading = false;
      this.feedlogError.emit({ error: 'At least one repository is required' });
      return;
    }
    try {
      this.loading = true;
      this.error = null;
      const params = {
        repositoryIds: repos,
      };
      if (this.type) {
        params.type = this.type;
      }
      if (this.limit) {
        params.limit = this.limit;
      }
      if (this.cursor) {
        params.cursor = this.cursor;
      }
      const response = await this.sdk.fetchIssues(params);
      this.issues = response.issues;
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch issues';
      this.error = errorMsg;
      this.issues = [];
      this.feedlogError.emit({
        error: errorMsg,
        code: err === null || err === void 0 ? void 0 : err.statusCode,
      });
    } finally {
      this.loading = false;
      this.isLoadingMore = false;
    }
  }
  async loadMore() {
    if (!this.sdk || !this.hasMore || this.isLoadingMore || this.loading) {
      return;
    }
    this.isLoadingMore = true;
    try {
      const repos = this.parseRepos();
      const params = {
        repositoryIds: repos,
      };
      if (this.type) {
        params.type = this.type;
      }
      if (this.limit) {
        params.limit = this.limit;
      }
      if (this.cursor) {
        params.cursor = this.cursor;
      }
      const response = await this.sdk.fetchIssues(params);
      this.issues = [...this.issues, ...response.issues];
      this.cursor = response.pagination.cursor;
      this.hasMore = response.pagination.hasMore;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load more issues';
      this.feedlogError.emit({
        error: errorMsg,
        code: err === null || err === void 0 ? void 0 : err.statusCode,
      });
    } finally {
      this.isLoadingMore = false;
    }
  }
  render() {
    return h('feedlog-github-issues', {
      key: '6cdf1a12be2ebf2ee170c442618de502c1057740',
      issues: this.issues,
      maxWidth: this.maxWidth,
      theme: this.theme,
      showThemeToggle: this.showThemeToggle,
      loading: this.loading,
      error: this.error,
      hasMore: this.hasMore,
      isLoadingMore: this.isLoadingMore,
      onFeedlogUpvote: this.handleUpvote,
      onFeedlogThemeChange: this.handleThemeChange,
      onFeedlogLoadMore: async () => this.loadMore(),
    });
  }
  static get is() {
    return 'feedlog-github-issues-client';
  }
  static get encapsulation() {
    return 'shadow';
  }
  static get properties() {
    return {
      repos: {
        type: 'string',
        mutable: false,
        complexType: {
          original: 'string[] | string',
          resolved: 'string | string[] | undefined',
          references: {},
        },
        required: false,
        optional: true,
        docs: {
          tags: [],
          text: 'Array of repository public IDs or single ID\nFormat: repository public ID (not owner/repo)',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'repos',
      },
      type: {
        type: 'string',
        mutable: false,
        complexType: {
          original: "'bug' | 'enhancement'",
          resolved: '"bug" | "enhancement" | undefined',
          references: {},
        },
        required: false,
        optional: true,
        docs: {
          tags: [],
          text: "Filter issues by type: 'bug' or 'enhancement'",
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'type',
      },
      limit: {
        type: 'number',
        mutable: false,
        complexType: {
          original: 'number',
          resolved: 'number | undefined',
          references: {},
        },
        required: false,
        optional: true,
        docs: {
          tags: [],
          text: 'Maximum number of issues to fetch (1-100, default 10)',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'limit',
      },
      endpoint: {
        type: 'string',
        mutable: false,
        complexType: {
          original: 'string',
          resolved: 'string | undefined',
          references: {},
        },
        required: false,
        optional: true,
        docs: {
          tags: [],
          text: 'Custom API endpoint',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'endpoint',
      },
      maxWidth: {
        type: 'string',
        mutable: false,
        complexType: {
          original: 'string',
          resolved: 'string',
          references: {},
        },
        required: false,
        optional: false,
        docs: {
          tags: [],
          text: 'Maximum width of the container',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'max-width',
        defaultValue: "'42rem'",
      },
      theme: {
        type: 'string',
        mutable: false,
        complexType: {
          original: "'light' | 'dark'",
          resolved: '"dark" | "light"',
          references: {},
        },
        required: false,
        optional: false,
        docs: {
          tags: [],
          text: "Theme variant: 'light' or 'dark'",
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'theme',
        defaultValue: "'light'",
      },
      showThemeToggle: {
        type: 'boolean',
        mutable: false,
        complexType: {
          original: 'boolean',
          resolved: 'boolean',
          references: {},
        },
        required: false,
        optional: false,
        docs: {
          tags: [],
          text: 'Whether to show the theme toggle button',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'show-theme-toggle',
        defaultValue: 'true',
      },
    };
  }
  static get states() {
    return {
      issues: {},
      loading: {},
      error: {},
      cursor: {},
      hasMore: {},
      isLoadingMore: {},
    };
  }
  static get events() {
    return [
      {
        method: 'feedlogUpvote',
        name: 'feedlogUpvote',
        bubbles: true,
        cancelable: true,
        composed: true,
        docs: {
          tags: [],
          text: 'Event emitted when an issue is upvoted',
        },
        complexType: {
          original: '{ issueId: string; upvoted: boolean; upvoteCount: number }',
          resolved: '{ issueId: string; upvoted: boolean; upvoteCount: number; }',
          references: {},
        },
      },
      {
        method: 'feedlogThemeChange',
        name: 'feedlogThemeChange',
        bubbles: true,
        cancelable: true,
        composed: true,
        docs: {
          tags: [],
          text: 'Event emitted when theme changes',
        },
        complexType: {
          original: "'light' | 'dark'",
          resolved: '"dark" | "light"',
          references: {},
        },
      },
      {
        method: 'feedlogError',
        name: 'feedlogError',
        bubbles: true,
        cancelable: true,
        composed: true,
        docs: {
          tags: [],
          text: 'Event emitted on error',
        },
        complexType: {
          original: '{ error: string; code?: number }',
          resolved: '{ error: string; code?: number | undefined; }',
          references: {},
        },
      },
    ];
  }
}
//# sourceMappingURL=feedlog-github-issues-client.js.map
