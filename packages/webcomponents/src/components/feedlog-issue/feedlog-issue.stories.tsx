import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import type { FeedlogIssue } from '@feedlog-ai/core';

const sampleBugIssue: FeedlogIssue = {
  id: 'issue-bug-1',
  title: 'Charts not rendering on mobile',
  body: 'The chart components are not properly responsive on smaller screens. They overflow the container and break the layout.',
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
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  upvoteCount: 3,
  hasUpvoted: false,
};

const sampleEnhancementIssue: FeedlogIssue = {
  id: 'issue-enhancement-1',
  title: 'Add dark mode support',
  body: 'It would be great to have a dark mode option for the dashboard. This would reduce eye strain for users working late at night.',
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
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  upvoteCount: 24,
  hasUpvoted: false,
};

const sampleUpvotedEnhancementIssue: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-enhancement-upvoted',
  hasUpvoted: true,
};

const samplePinnedIssue: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-enhancement-pinned',
  pinnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
};

const sampleJustCreatedIssue: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-just-created',
  updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
  createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // same as updated
  upvoteCount: 0,
};

const meta: Meta = {
  title: 'Components/Issue',
  component: 'feedlog-issue',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    issue: {
      control: 'object',
      description: 'The issue to display',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme variant',
    },
  },
  args: {
    issue: sampleEnhancementIssue,
    theme: 'light',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    issue: sampleEnhancementIssue,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const Bug: Story = {
  args: {
    issue: sampleBugIssue,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const Upvoted: Story = {
  args: {
    issue: sampleUpvotedEnhancementIssue,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const Pinned: Story = {
  args: {
    issue: samplePinnedIssue,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const DarkTheme: Story = {
  args: {
    issue: sampleEnhancementIssue,
    theme: 'dark',
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const DarkThemeBug: Story = {
  args: {
    issue: sampleBugIssue,
    theme: 'dark',
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const DarkThemePinned: Story = {
  args: {
    issue: samplePinnedIssue,
    theme: 'dark',
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const HighUpvoteCount: Story = {
  args: {
    issue: {
      ...sampleEnhancementIssue,
      id: 'issue-high-upvote',
      upvoteCount: 156,
    },
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const RecentlyCreated: Story = {
  args: {
    issue: sampleJustCreatedIssue,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const CustomCSSVars: Story = {
  args: {
    issue: sampleEnhancementIssue,
  },
  render: (props: any) => (
    <feedlog-issue
      {...props}
      style={
        {
          '--feedlog-card-accent-width': '4px',
          '--feedlog-title-font-size': '1rem',
          '--feedlog-radius': '0.75rem',
        } as any
      }
    />
  ),
};
