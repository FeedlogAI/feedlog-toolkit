import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import type { FeedlogIssue } from '@feedlog-ai/core';

const sampleBugIssue: FeedlogIssue = {
  id: 'iss_bug_charts_mobile',
  githubIssueLink: null,
  title: 'Charts not rendering on mobile',
  body: 'The chart components are not properly responsive on smaller screens. They overflow the container and break the layout.',
  type: 'bug' as const,
  status: 'open' as const,
  pinnedAt: null,
  revision: 1,
  repository: {
    id: 'rep_755dtvwg9d6r',
    name: 'Infrastructure',
    description: null,
  },
  updatedAt: '2026-03-19T12:00:00.000Z',
  createdAt: '2026-03-19T10:00:00.000Z',
  upvoteCount: 3,
  hasUpvoted: false,
};

const sampleEnhancementIssue: FeedlogIssue = {
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
  title: 'Add support for native GitHub Issue Types',
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

const issueWithGithubLink: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-with-gh',
  githubIssueLink: 'https://github.com/feedlog/feedlog-toolkit/issues/42',
  title: 'Add support for native GitHub Issue Types',
};

const issueWithGithubLinkNull: FeedlogIssue = {
  ...sampleEnhancementIssue,
  id: 'issue-private-repo',
  githubIssueLink: null,
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
      description: 'Optional GitHub issue URL (when githubIssueLink is not available)',
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
          fontFamily: "'Georgia', 'Times New Roman', serif",
          /* Card */
          '--feedlog-card-padding': '1.5rem',
          '--feedlog-card-radius': '0.875rem',
          '--feedlog-radius': '0.875rem',
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
};

/** Explicit tokens aligned with feedlog.dev marketing surfaces (compare to Default). */
export const FeedLogMarketingTheme: Story = {
  args: {
    issue: sampleEnhancementIssue,
  },
  render: (props: any) => (
    <feedlog-issue
      {...props}
      style={
        {
          '--feedlog-font-family':
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          '--feedlog-muted': '#f4f4f5',
          '--feedlog-border': 'rgba(0, 0, 0, 0.06)',
          '--feedlog-card-radius': '1rem',
          '--feedlog-card-accent-height': '3px',
          '--feedlog-shadow': '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
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

export const WithGithubIssueLink: Story = {
  args: {
    issue: issueWithGithubLink,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};

export const GithubIssueLinkNull: Story = {
  args: {
    issue: issueWithGithubLinkNull,
  },
  render: (props: any) => <feedlog-issue {...props} />,
};
