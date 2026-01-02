import { h, Host } from '@stencil/core';
/**
 * Sun icon SVG component
 */
const SunIcon = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    h('circle', { cx: '12', cy: '12', r: '4' }),
    h('path', { d: 'M12 2v2' }),
    h('path', { d: 'M12 20v2' }),
    h('path', { d: 'm4.93 4.93 1.41 1.41' }),
    h('path', { d: 'm17.66 17.66 1.41 1.41' }),
    h('path', { d: 'M2 12h2' }),
    h('path', { d: 'M20 12h2' }),
    h('path', { d: 'm6.34 17.66-1.41 1.41' }),
    h('path', { d: 'm19.07 4.93-1.41 1.41' })
  );
/**
 * Moon icon SVG component
 */
const MoonIcon = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    h('path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' })
  );
/**
 * Feedlog GitHub Issues Base Component
 *
 * Shared base component for displaying GitHub issues with support for bugs and enhancements.
 * This component handles the UI rendering and delegates to feedlog-issues-list for the actual list.
 */
export class FeedlogGithubIssuesBase {
  constructor() {
    /**
     * Array of issues to display
     */
    this.issues = [];
    /**
     * Maximum width of the container
     */
    this.maxWidth = '42rem';
    /**
     * Theme variant: 'light' or 'dark'
     */
    this.theme = 'light';
    /**
     * Loading state - shows loading indicator when true
     */
    this.loading = false;
    /**
     * Error message - shows error state when set
     */
    this.error = null;
    /**
     * Whether to show the theme toggle button
     */
    this.showThemeToggle = true;
    /**
     * Internal state for theme
     */
    this.currentTheme = 'light';
    this.handleUpvote = event => {
      this.feedlogUpvote.emit(event.detail);
    };
    this.toggleTheme = () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.theme = this.currentTheme;
      this.feedlogThemeChange.emit(this.currentTheme);
    };
  }
  componentWillLoad() {
    this.currentTheme = this.theme;
  }
  render() {
    const containerStyle = {
      maxWidth: this.maxWidth,
    };
    return h(
      Host,
      {
        key: '150d8878003662c75e3d85e50fc2e72cbfe96169',
        class: this.currentTheme === 'dark' ? 'dark' : '',
      },
      h(
        'div',
        {
          key: '2fa8fe8786b5191815d3f00344618d07823d429b',
          class: 'github-issues-container',
          style: containerStyle,
        },
        h(
          'header',
          { key: '3f825f43f4974915bf73513d5d2cddbaa7983ab8', class: 'issues-header' },
          h(
            'div',
            { key: 'f773a2f6321cc2ab58cc11315584de4119edceec', class: 'header-content' },
            h(
              'h1',
              { key: 'e851f956480be6465ba8466eda46f6552c8c50dc', class: 'issues-title' },
              'GitHub Issues'
            ),
            h(
              'p',
              { key: 'b7b06a87e584068268034385eb9d7ec01c7c02c1', class: 'issues-subtitle' },
              'Track bugs and enhancements for your project'
            )
          ),
          this.showThemeToggle &&
            h(
              'feedlog-button',
              {
                key: '81762032e534f8f56305e98c1d8d1c262dd48c83',
                variant: 'outline',
                size: 'sm',
                onFeedlogClick: this.toggleTheme,
              },
              this.currentTheme === 'dark' ? h(SunIcon, null) : h(MoonIcon, null)
            )
        ),
        this.loading &&
          h(
            'div',
            { key: '5c92c10057a95d06e3ee574ad19510d56fc7c8c5', class: 'loading-state' },
            h('p', { key: '3228dc8c365597d36e9ca0434ced71b4b6d05685' }, 'Loading issues...')
          ),
        this.error &&
          h(
            'div',
            { key: 'a8666bb3cde4a7fe36404b58743ea66370e9b172', class: 'error-state' },
            h('p', { key: 'df59fe1154c8c6342f8e40c77658a7e2afa39a20' }, 'Error: ', this.error)
          ),
        !this.loading &&
          !this.error &&
          h('feedlog-issues-list', {
            key: 'aa91fd16af2a7037fc95111a539f154c311e9f84',
            issues: this.issues,
            theme: this.currentTheme,
            onFeedlogUpvote: this.handleUpvote,
          })
      )
    );
  }
  static get is() {
    return 'feedlog-github-issues-base';
  }
  static get encapsulation() {
    return 'shadow';
  }
  static get originalStyleUrls() {
    return {
      $: ['feedlog-github-issues-base.css'],
    };
  }
  static get styleUrls() {
    return {
      $: ['feedlog-github-issues-base.css'],
    };
  }
  static get properties() {
    return {
      issues: {
        type: 'unknown',
        mutable: false,
        complexType: {
          original: 'GitHubIssue[]',
          resolved: 'GitHubIssue[]',
          references: {
            GitHubIssue: {
              location: 'import',
              path: '@feedlog-ai/core',
              id: '../core/dist/index.d.ts::GitHubIssue',
            },
          },
        },
        required: false,
        optional: false,
        docs: {
          tags: [],
          text: 'Array of issues to display',
        },
        getter: false,
        setter: false,
        defaultValue: '[]',
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
        mutable: true,
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
      loading: {
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
          text: 'Loading state - shows loading indicator when true',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'loading',
        defaultValue: 'false',
      },
      error: {
        type: 'string',
        mutable: false,
        complexType: {
          original: 'string | null',
          resolved: 'null | string',
          references: {},
        },
        required: false,
        optional: false,
        docs: {
          tags: [],
          text: 'Error message - shows error state when set',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'error',
        defaultValue: 'null',
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
      currentTheme: {},
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
          original: 'number',
          resolved: 'number',
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
    ];
  }
}
//# sourceMappingURL=feedlog-github-issues-base.js.map
