import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import type { FeedlogIssue } from '@feedlog-ai/core';

/** API-shaped sample issues (matches FetchIssuesResponse) plus bug examples for badge coverage */
const sampleIssues: FeedlogIssue[] = [
  {
    id: 'iss_365sfvyqb434',
    githubIssueLink: null,
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    title: 'Add support for native GitHub Issue Types',
    body: "## Motivation\nGitHub has introduced a native 'Issue Type' field at the organization level to provide a structured way to categorize work, replacing the inconsistent use of labels or project-specific custom fields.\n\n## What’s Changing\nThe system will now support the native GitHub 'Issue Type' property as the primary source of truth for categorizing issues. Integration will be updated to read the 'issue.type' field from webhooks and API responses.\n\n## Expected Behavior\n1. The system will prioritize the 'issue.type.name' field to determine the issue category.\n2. Existing label-based categorization will be maintained as a fallback mechanism for issues where the native type is not defined.\n3. The application will correctly ignore project-level 'Type' fields to avoid data conflicts.",
    revision: 2,
    repository: {
      id: 'rep_755dtvwg9d6r',
      name: 'Infrastructure',
      description: null,
    },
    updatedAt: '2026-03-23T16:42:40.555Z',
    createdAt: '2026-03-23T16:41:06.302Z',
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'iss_9k1ums2a23s1',
    githubIssueLink: null,
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    title: 'Introduce Release issue type for hierarchical task management',
    body: '## Motivation\nUsers currently lack a native way to group related enhancements and bug fixes under a single release umbrella, making it difficult to track progress across multiple smaller tasks.\n\n## What’s Changing\nA new "Release" parent issue type is being introduced to allow for the nesting of enhancement and bug issues as sub-tasks.\n\n## Expected Behavior\n1. Users can create a parent Release issue without requiring specific labels.\n2. Enhancement and bug issues can be linked as children to a parent Release issue by leveraging existing GitHub sub-issue functionality.\n3. The interface will display all associated sub-issues directly under the parent Release issue for improved visibility.',
    revision: 4,
    repository: {
      id: 'rep_755dtvwg9d6r',
      name: 'Infrastructure',
      description: null,
    },
    updatedAt: '2026-03-21T17:01:16.642Z',
    createdAt: '2026-03-21T16:57:19.826Z',
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'iss_zwhnnqy38zmi',
    githubIssueLink: null,
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    title: 'Implement structured user feedback collection via forms',
    body: '## Motivation\nCurrent feedback mechanisms are limited to simple upvote buttons, which lack the granularity required to understand specific user preferences or pain points. \n\n## What’s Changing\nThis update introduces a structured feedback collection system supporting checkboxes, radio buttons, and custom form fields. Feedback data submitted by users will be automatically aggregated and posted directly to the corresponding GitHub issue. \n\n## Expected Behavior\n1. Users can select multiple options via checkboxes or single options via radio buttons within a feedback form.\n2. Submitted feedback responses are automatically compiled and displayed as a summary within the relevant GitHub issue.',
    revision: 3,
    repository: {
      id: 'rep_755dtvwg9d6r',
      name: 'Infrastructure',
      description: null,
    },
    updatedAt: '2026-03-21T16:47:18.550Z',
    createdAt: '2026-03-21T16:41:04.709Z',
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'iss_w5nhudiz7udm',
    githubIssueLink: null,
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    title: 'Enable media support for card components',
    body: '## Motivation\nCard components currently lack the ability to display visual content, limiting the ability to effectively illustrate issues or provide context.\n\n## What’s Changing\nSupport for embedded media, including images and videos, is being integrated into card components using standard Markdown syntax.\n\n## Expected Behavior\n1. Images and videos included in the Markdown content will render correctly within the card component.\n2. Media rendering will mirror the display behavior currently utilized in issue bodies.',
    revision: 6,
    repository: {
      id: 'rep_755dtvwg9d6r',
      name: 'Infrastructure',
      description: null,
    },
    updatedAt: '2026-03-21T07:37:58.605Z',
    createdAt: '2026-03-20T15:18:47.674Z',
    upvoteCount: 1,
    hasUpvoted: false,
  },
  {
    id: 'iss_bug_charts_mobile',
    githubIssueLink: null,
    type: 'bug' as const,
    status: 'open' as const,
    pinnedAt: null,
    title: 'Charts not rendering on mobile',
    body: 'The chart components are not properly responsive on smaller screens.',
    revision: 1,
    repository: {
      id: 'rep_755dtvwg9d6r',
      name: 'Infrastructure',
      description: null,
    },
    updatedAt: '2026-03-19T12:00:00.000Z',
    createdAt: '2026-03-19T10:00:00.000Z',
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'iss_bug_memory_leak',
    githubIssueLink: null,
    type: 'bug' as const,
    status: 'open' as const,
    pinnedAt: null,
    title: 'Memory leak in real-time updates',
    body: 'When leaving the dashboard open for extended periods, memory usage increases significantly.',
    revision: 1,
    repository: {
      id: 'rep_755dtvwg9d6r',
      name: 'Infrastructure',
      description: null,
    },
    updatedAt: '2026-03-18T09:30:00.000Z',
    createdAt: '2026-03-17T14:00:00.000Z',
    upvoteCount: 0,
    hasUpvoted: false,
  },
];

const meta: Meta = {
  title: 'Components/Issues',
  component: 'feedlog-issues',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    issues: {
      control: 'object',
      description: 'Array of issues to display',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the container',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme variant',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    emptyStateTitle: {
      control: 'text',
      description: 'Empty state title',
    },
    emptyStateMessage: {
      control: 'text',
      description: 'Empty state message',
    },
    limit: {
      control: 'number',
      description: 'Items per page (skeleton count for load-more)',
    },
    paginationType: {
      control: 'select',
      options: ['load-more', 'prev-next'],
      description: 'Pagination strategy',
    },
    collapsible: {
      control: 'boolean',
      description: 'When true, each issue card has a collapsible markdown body',
    },
  },
  args: {
    issues: sampleIssues,
    maxWidth: '56rem',
    theme: 'light',
    loading: false,
    error: null,
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    issues: sampleIssues,
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const Loading: Story = {
  args: {
    issues: [],
    loading: true,
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const Error: Story = {
  args: {
    issues: [],
    loading: false,
    error: "Couldn't load updates",
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const Empty: Story = {
  args: {
    issues: [],
    loading: false,
    error: null,
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const DarkTheme: Story = {
  args: {
    issues: sampleIssues,
    theme: 'dark',
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const NarrowWidth: Story = {
  args: {
    issues: sampleIssues.slice(0, 3),
    maxWidth: '32rem',
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const TransparentBackground: Story = {
  args: {
    issues: sampleIssues,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `--feedlog-background: transparent` to let the parent background show through. Useful when embedding in dashboards or custom layouts.',
      },
    },
  },
  render: (props: any) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
      }}
    >
      <feedlog-issues {...props} style={{ '--feedlog-background': 'transparent' } as any} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const LoadMore: Story = {
  args: {
    issues: sampleIssues.slice(0, 3),
    hasMore: true,
    limit: 3,
    paginationType: 'load-more',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Load-more pagination. Click the button to simulate loading more issues with skeleton placeholders.',
      },
    },
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element) {
      if (args.issues) (element as any).issues = args.issues;
      (element as any).hasMore = true;
      (element as any).limit = args.limit;
      (element as any).paginationType = 'load-more';
    }
  },
};

export const LoadMoreLoading: Story = {
  args: {
    issues: sampleIssues.slice(0, 3),
    hasMore: true,
    isLoadingMore: true,
    limit: 3,
    paginationType: 'load-more',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Load-more in loading state: skeleton cards appear below existing issues while new ones are fetched.',
      },
    },
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element) {
      if (args.issues) (element as any).issues = args.issues;
      (element as any).hasMore = true;
      (element as any).isLoadingMore = true;
      (element as any).limit = args.limit;
      (element as any).paginationType = 'load-more';
    }
  },
};

export const PrevNext: Story = {
  args: {
    issues: sampleIssues.slice(0, 3),
    hasMore: true,
    hasPrev: false,
    paginationType: 'prev-next',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Prev/next pagination with simple arrow buttons. Prev is disabled on the first page.',
      },
    },
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element) {
      if (args.issues) (element as any).issues = args.issues;
      (element as any).hasMore = true;
      (element as any).hasPrev = false;
      (element as any).paginationType = 'prev-next';
    }
  },
};

export const PrevNextMiddlePage: Story = {
  args: {
    issues: sampleIssues.slice(2, 5),
    hasMore: true,
    hasPrev: true,
    paginationType: 'prev-next',
  },
  parameters: {
    docs: {
      description: {
        story: 'Prev/next on a middle page: both Prev and Next are enabled.',
      },
    },
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element) {
      if (args.issues) (element as any).issues = args.issues;
      (element as any).hasMore = true;
      (element as any).hasPrev = true;
      (element as any).paginationType = 'prev-next';
    }
  },
};

export const CustomCSSVars: Story = {
  args: {
    issues: sampleIssues,
  },
  render: (props: any) => (
    <feedlog-issues
      {...props}
      style={
        {
          fontFamily: "'Georgia', 'Times New Roman', serif",
          /* Card */
          '--feedlog-card-padding': '1.25rem',
          '--feedlog-card-radius': '0.875rem',
          '--feedlog-radius': '0.875rem',
          '--feedlog-gap': '1.25rem',
          '--feedlog-shadow': '0 2px 8px 0 rgba(0, 0, 0, 0.12), 0 1px 3px -1px rgba(0, 0, 0, 0.1)',
          '--feedlog-shadow-hover-enhancement':
            '0 8px 24px -4px rgba(5, 150, 105, 0.15), 0 4px 8px -2px rgba(5, 150, 105, 0.1)',
          '--feedlog-shadow-hover-bug':
            '0 8px 24px -4px rgba(220, 38, 38, 0.15), 0 4px 8px -2px rgba(220, 38, 38, 0.1)',
          /* Typography */
          '--feedlog-title-font-size': '1.0625rem',
          '--feedlog-title-font-weight': '700',
          '--feedlog-body-font-size': '0.875rem',
          '--feedlog-body-line-height': '1.6',
          '--feedlog-timestamp-font-size': '0.75rem',
          /* Colors */
          '--feedlog-accent-color': '#059669',
          '--feedlog-muted': '#ecfdf5',
          '--feedlog-muted-foreground': '#047857',
          '--feedlog-border': 'rgba(5, 150, 105, 0.2)',
        } as any
      }
    />
  ),
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const Collapsible: Story = {
  args: {
    issues: sampleIssues.slice(0, 2),
    collapsible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passes `collapsible` to nested issue cards (chevron down collapsed, up expanded; [Remix arrow-up-s-line](https://allsvgicons.com/pack/ri/#arrow-up-s-line)).',
      },
    },
  },
  render: props => <feedlog-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};
