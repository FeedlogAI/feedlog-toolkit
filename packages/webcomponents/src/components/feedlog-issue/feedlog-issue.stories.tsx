import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import type { FeedlogIssue } from '@feedlog-ai/core';

const sampleBugIssue: FeedlogIssue = {
  id: 'issue-bug-1',
  githubIssueNumber: 42,
  title: 'Charts not rendering on mobile',
  body: 'The chart components are not properly responsive on smaller screens. They overflow the container and break the layout.',
  type: 'bug' as const,
  status: 'open' as const,
  pinnedAt: null,
  revision: 1,
  repository: {
    id: 'repo-1',
    name: 'My App',
    description: 'Main application repository',
  },
  updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  upvoteCount: 3,
  hasUpvoted: false,
};

const sampleEnhancementIssue: FeedlogIssue = {
  id: 'issue-enhancement-1',
  githubIssueNumber: 24,
  title: 'Add dark mode support',
  body: 'It would be great to have a dark mode option for the dashboard. This would reduce eye strain for users working late at night.',
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

/* --- API Change Stories (2025-02-16) --- */

const repositoryWithNullName: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-null-repo-name',
  repository: {
    id: 'repo-2',
    name: null,
    description: 'Repository has no display name set.',
  },
};

const repositoryWithNullDescription: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-null-repo-desc',
  repository: {
    id: 'repo-3',
    name: 'My Public Repo',
    description: null,
  },
};

const repositoryWithDescription: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-repo-with-desc',
  repository: {
    id: 'repo-4',
    name: 'Main App',
    description: 'Main application repository - hover over the name to see this.',
  },
};

const issueInProgress: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-in-progress',
  status: 'in_progress' as const,
  title: 'Add dark mode support',
};

const issueClosedBug: FeedlogIssue = {
  ...sampleBugIssue,
  id: 'issue-closed-bug',
  status: 'closed' as const,
  title: 'Login fails on Safari',
};

const issueClosedEnhancement: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-closed-enhancement',
  status: 'closed' as const,
  title: 'Export data to CSV',
};

const issueWithGithubNumber: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-with-gh',
  githubIssueNumber: 42,
  title: 'Add dark mode support',
};

const issueWithGithubNumberNull: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-private-repo',
  githubIssueNumber: null,
  title: 'Private repo issue',
  repository: {
    id: 'repo-private',
    name: 'Private Repo',
    description: null,
  },
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
    issueUrl: {
      control: 'text',
      description: 'Optional GitHub issue URL (when githubIssueNumber is available)',
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

/* --- API Change Stories (2025-02-16) --- */

export const RepositoryNullName: Story = {
  args: {
    issue: repositoryWithNullName,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const RepositoryNullDescription: Story = {
  args: {
    issue: repositoryWithNullDescription,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const RepositoryWithDescription: Story = {
  args: {
    issue: repositoryWithDescription,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const StatusInProgress: Story = {
  args: {
    issue: issueInProgress,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const StatusClosedBug: Story = {
  args: {
    issue: issueClosedBug,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const StatusClosedEnhancement: Story = {
  args: {
    issue: issueClosedEnhancement,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const WithGithubIssueNumber: Story = {
  args: {
    issue: issueWithGithubNumber,
    issueUrl: 'https://github.com/feedlog/feedlog-toolkit/issues/42',
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const GithubIssueNumberNull: Story = {
  args: {
    issue: issueWithGithubNumberNull,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};
