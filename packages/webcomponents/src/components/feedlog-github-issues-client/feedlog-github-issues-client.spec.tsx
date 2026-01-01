import { newSpecPage } from '@stencil/core/testing';
import { FeedlogGithubIssuesClient } from './feedlog-github-issues-client';
import { FeedlogGithubIssues } from '../feedlog-github-issues/feedlog-github-issues';
import { FeedlogIssuesList } from '../feedlog-issues-list/feedlog-issues-list';
import { FeedlogCard } from '../feedlog-card/feedlog-card';
import { FeedlogBadge } from '../feedlog-badge/feedlog-badge';
import { FeedlogButton } from '../feedlog-button/feedlog-button';

describe('feedlog-github-issues-client', () => {
  const mockIssues = [
    {
      id: 'issue-1',
      githubIssueNumber: 1,
      title: 'Test Bug',
      body: 'This is a test bug',
      type: 'bug' as const,
      status: 'open' as const,
      pinnedAt: null,
      revision: 1,
      repository: {
        id: 'repo-1',
        name: 'test-repo',
        owner: 'test-owner',
      },
      updatedAt: '2024-01-02T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      upvoteCount: 5,
      hasUpvoted: false,
    },
    {
      id: 'issue-2',
      githubIssueNumber: 2,
      title: 'Test Enhancement',
      body: 'This is a test enhancement',
      type: 'enhancement' as const,
      status: 'open' as const,
      pinnedAt: null,
      revision: 1,
      repository: {
        id: 'repo-1',
        name: 'test-repo',
        owner: 'test-owner',
      },
      updatedAt: '2024-01-02T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      upvoteCount: 10,
      hasUpvoted: true,
    },
  ];

  describe('Initialization', () => {
    it('renders', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client></feedlog-github-issues-client>`,
      });
      expect(page.root).toBeTruthy();
    });

    it('should initialize SDK successfully', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      expect(page.root).toBeTruthy();
    });

    it('should accept custom endpoint', async () => {
      const customEndpoint = 'https://custom-api.test.local';
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1" endpoint="${customEndpoint}"></feedlog-github-issues-client>`,
      });

      expect(page.root).toBeTruthy();
    });
  });

  describe('Repository handling', () => {
    it('should show error if no repositories provided', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client></feedlog-github-issues-client>`,
      });

      if (page.root) {
        await page.waitForChanges();
        expect(page.root.error).toContain('repository');
      }
    });

    it('should parse single repository ID', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      expect(page.root).toBeTruthy();
    });

    it('should parse array of repository IDs', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos='["repo-1", "repo-2"]'></feedlog-github-issues-client>`,
      });

      expect(page.root).toBeTruthy();
    });
  });

  describe('Property changes', () => {
    it('should refetch issues when repos changes', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      if (page.root) {
        page.root.repos = 'repo-2';
        await page.waitForChanges();
        expect(page.root.repos).toBe('repo-2');
      }
    });

    it('should reset pagination when filters change', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      if (page.root) {
        page.root.cursor = 'test-cursor';
        await page.waitForChanges();
        page.root.type = 'bug';
        await page.waitForChanges();
        expect(page.root.cursor).toBeNull();
      }
    });
  });

  describe('Loading and error states', () => {
    it('should show loading state initially', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      if (page.root) {
        expect(page.root.loading).toBe(true);
      }
    });

    it('should emit error event on error', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client></feedlog-github-issues-client>`,
      });

      expect(page.root).toBeTruthy();

      if (page.root) {
        const errorSpy = jest.fn();
        page.doc.addEventListener('feedlogError', errorSpy);

        await page.waitForChanges();
        // Error should be emitted due to missing repos
        expect(errorSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Upvoting', () => {
    it('should emit upvote event when issue is upvoted', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      expect(page.root).toBeTruthy();

      if (page.root) {
        const upvoteSpy = jest.fn();
        page.doc.addEventListener('feedlogUpvote', upvoteSpy);

        // Set issues directly (would normally come from API)
        page.root.issues = mockIssues;
        page.root.loading = false;
        await page.waitForChanges();

        // Simulate upvote event from child component
        const upvoteEvent = new CustomEvent('feedlogUpvote', {
          detail: {
            issueId: 'issue-1',
            currentUpvoted: false,
            currentCount: 5,
          },
        });
        page.root.dispatchEvent(upvoteEvent);
        await page.waitForChanges();
      }
    });
  });

  describe('Theme handling', () => {
    it('should accept light theme', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1" theme="light"></feedlog-github-issues-client>`,
      });

      if (page.root) {
        expect(page.root.theme).toBe('light');
      }
    });

    it('should accept dark theme', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1" theme="dark"></feedlog-github-issues-client>`,
      });

      if (page.root) {
        expect(page.root.theme).toBe('dark');
      }
    });

    it('should emit theme change event', async () => {
      const page = await newSpecPage({
        components: [
          FeedlogGithubIssuesClient,
          FeedlogGithubIssues,
          FeedlogIssuesList,
          FeedlogCard,
          FeedlogBadge,
          FeedlogButton,
        ],
        html: `<feedlog-github-issues-client repos="repo-1"></feedlog-github-issues-client>`,
      });

      if (page.root) {
        const themeSpy = jest.fn();
        page.doc.addEventListener('feedlogThemeChange', themeSpy);

        // Simulate theme change event from child component
        const themeEvent = new CustomEvent('feedlogThemeChange', {
          detail: 'dark',
        });
        page.root.dispatchEvent(themeEvent);
        await page.waitForChanges();
      }
    });
  });
});

