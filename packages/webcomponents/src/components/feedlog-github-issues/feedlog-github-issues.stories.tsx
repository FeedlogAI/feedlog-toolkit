import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import type { FeedlogIssue } from '@feedlog-ai/core';

const sampleIssues: FeedlogIssue[] = [
  {
    id: 'issue-1',
    githubIssueLink: 'https://github.com/feedlog/feedlog-toolkit/issues/24',
    title: 'Add dark mode support',
    body: 'It would be great to have a dark mode option for the dashboard.',
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      description: 'Monorepo for Feedlog Toolkit',
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 24,
    hasUpvoted: false,
  },
  {
    id: 'issue-2',
    githubIssueLink: 'https://github.com/feedlog/feedlog-toolkit/issues/15',
    title: 'Charts not rendering on mobile',
    body: 'The chart components are not properly responsive on smaller screens.',
    type: 'bug' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      description: 'Monorepo for Feedlog Toolkit',
    },
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'issue-3',
    githubIssueLink: 'https://github.com/feedlog/feedlog-toolkit/issues/8',
    title: 'Export data to CSV',
    body: 'Add functionality to export chart data as CSV files.',
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      description: 'Monorepo for Feedlog Toolkit',
    },
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 15,
    hasUpvoted: false,
  },
  {
    id: 'issue-4',
    githubIssueLink: 'https://github.com/feedlog/feedlog-toolkit/issues/12',
    title: 'Memory leak in real-time updates',
    body: 'When leaving the dashboard open for extended periods, memory usage increases significantly.',
    type: 'bug' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      description: 'Monorepo for Feedlog Toolkit',
    },
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'issue-5',
    githubIssueLink: null,
    title: 'Custom color themes',
    body: 'Allow users to customize the color palette for charts and UI elements.',
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      description: 'Monorepo for Feedlog Toolkit',
    },
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 8,
    hasUpvoted: false,
  },
];

const meta: Meta = {
  title: 'Components/GitHub Issues',
  component: 'feedlog-github-issues',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    issues: {
      control: 'object',
      description: 'Array of GitHub issues to display',
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
  render: props => <feedlog-github-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-github-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const Loading: Story = {
  args: {
    issues: [],
    loading: true,
    heading: 'Community feedback',
    subtitle: 'Upvote issues you care about',
  },
  render: props => <feedlog-github-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-github-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const Error: Story = {
  args: {
    issues: [],
    loading: false,
    error: 'Failed to fetch issues from GitHub API',
    heading: 'Community feedback',
    subtitle: 'Upvote issues you care about',
  },
  render: props => <feedlog-github-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-github-issues');
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
    heading: 'Community feedback',
    subtitle: 'Upvote issues you care about',
  },
  render: props => <feedlog-github-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-github-issues');
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
  render: props => <feedlog-github-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-github-issues');
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
  render: props => <feedlog-github-issues {...props} />,
  play: async ({ canvasElement, args }) => {
    const element = canvasElement.querySelector('feedlog-github-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};

export const CustomCSSVars: Story = {
  args: {
    issues: sampleIssues,
  },
  render: (props: any) => (
    <feedlog-github-issues
      {...props}
      style={
        {
          fontFamily: "'Georgia', 'Times New Roman', serif",
          /* Card */
          '--feedlog-card-padding': '1.5rem',
          '--feedlog-card-accent-width': '5px',
          '--feedlog-radius': '0.875rem',
          '--feedlog-shadow': '0 2px 8px 0 rgba(0, 0, 0, 0.12), 0 1px 3px -1px rgba(0, 0, 0, 0.1)',
          '--feedlog-shadow-hover':
            '0 8px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
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
    const element = canvasElement.querySelector('feedlog-github-issues');
    if (element && args.issues) {
      (element as any).issues = args.issues;
    }
  },
};
