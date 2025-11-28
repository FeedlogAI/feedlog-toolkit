import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import { FeedlogGithubIssues } from './feedlog-github-issues';

const sampleIssues = [
  {
    id: 1,
    title: 'Add dark mode support',
    body: 'It would be great to have a dark mode option for the dashboard.',
    type: 'enhancement' as const,
    upvotes: 24,
    postedAt: '2 hours ago',
  },
  {
    id: 2,
    title: 'Charts not rendering on mobile',
    body: 'The chart components are not properly responsive on smaller screens.',
    type: 'bug' as const,
    postedAt: '5 hours ago',
  },
  {
    id: 3,
    title: 'Export data to CSV',
    body: 'Add functionality to export chart data as CSV files.',
    type: 'enhancement' as const,
    upvotes: 15,
    postedAt: '1 day ago',
  },
  {
    id: 4,
    title: 'Memory leak in real-time updates',
    body: 'When leaving the dashboard open for extended periods, memory usage increases significantly.',
    type: 'bug' as const,
    postedAt: '2 days ago',
  },
  {
    id: 5,
    title: 'Custom color themes',
    body: 'Allow users to customize the color palette for charts and UI elements.',
    type: 'enhancement' as const,
    upvotes: 8,
    postedAt: '1 week ago',
  },
];

const meta: Meta<FeedlogGithubIssues> = {
  title: 'Components/GitHub Issues',
  component: FeedlogGithubIssues,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Issues data as JSON string or array',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the container',
    },
  },
  args: {
    data: JSON.stringify(sampleIssues),
    maxWidth: '56rem',
  },
};

export default meta;

type Story = StoryObj<FeedlogGithubIssues>;

export const Default: Story = {
  args: {
    data: JSON.stringify(sampleIssues),
  },
  render: props => <feedlog-github-issues {...props} />,
};

export const EnhancementsOnly: Story = {
  args: {
    data: JSON.stringify(sampleIssues.filter(issue => issue.type === 'enhancement')),
  },
  render: props => <feedlog-github-issues {...props} />,
};

export const BugsOnly: Story = {
  args: {
    data: JSON.stringify(sampleIssues.filter(issue => issue.type === 'bug')),
  },
  render: props => <feedlog-github-issues {...props} />,
};

export const EmptyState: Story = {
  args: {
    data: JSON.stringify([]),
  },
  render: props => <feedlog-github-issues {...props} />,
};

export const NarrowWidth: Story = {
  args: {
    data: JSON.stringify(sampleIssues.slice(0, 3)),
    maxWidth: '32rem',
  },
  render: props => <feedlog-github-issues {...props} />,
};

export const SingleIssue: Story = {
  args: {
    data: JSON.stringify([sampleIssues[0]]),
  },
  render: props => <feedlog-github-issues {...props} />,
};
