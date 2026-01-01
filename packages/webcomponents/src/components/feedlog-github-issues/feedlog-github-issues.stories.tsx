import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import { FeedlogGithubIssues } from './feedlog-github-issues';
import type { FeedlogIssue } from '@feedlog-toolkit/core';

const sampleIssues: FeedlogIssue[] = [
  {
    id: 'issue-1',
    title: 'Add dark mode support',
    body: 'It would be great to have a dark mode option for the dashboard.',
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      owner: 'feedlog',
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 24,
    hasUpvoted: false,
  },
  {
    id: 'issue-2',
    title: 'Charts not rendering on mobile',
    body: 'The chart components are not properly responsive on smaller screens.',
    type: 'bug' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      owner: 'feedlog',
    },
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'issue-3',
    title: 'Export data to CSV',
    body: 'Add functionality to export chart data as CSV files.',
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      owner: 'feedlog',
    },
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 15,
    hasUpvoted: false,
  },
  {
    id: 'issue-4',
    title: 'Memory leak in real-time updates',
    body: 'When leaving the dashboard open for extended periods, memory usage increases significantly.',
    type: 'bug' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      owner: 'feedlog',
    },
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 0,
    hasUpvoted: false,
  },
  {
    id: 'issue-5',
    title: 'Custom color themes',
    body: 'Allow users to customize the color palette for charts and UI elements.',
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: {
      id: 'repo-1',
      name: 'feedlog-toolkit',
      owner: 'feedlog',
    },
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    upvoteCount: 8,
    hasUpvoted: false,
  },
];

const meta: Meta<FeedlogGithubIssues> = {
  title: 'Components/GitHub Issues',
  component: FeedlogGithubIssues,
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

type Story = StoryObj<FeedlogGithubIssues>;

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
