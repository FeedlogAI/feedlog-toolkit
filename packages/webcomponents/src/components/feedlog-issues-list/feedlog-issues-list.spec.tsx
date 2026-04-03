import { newSpecPage } from '@stencil/core/testing';
import type { FeedlogIssue } from '@feedlog-ai/core';
import { FeedlogIssuesList } from './feedlog-issues-list';

const createMockIssue = (id: string, title: string): FeedlogIssue => ({
  id,
  githubIssueLink: `https://github.com/test/repo/issues/${id}`,
  title,
  body: 'Description',
  type: 'enhancement',
  status: 'open',
  pinnedAt: null,
  revision: 1,
  repository: { id: 'repo-1', name: 'test-repo', description: null },
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  upvoteCount: 0,
  hasUpvoted: false,
});

const createMockIssues = (count: number): FeedlogIssue[] =>
  Array.from({ length: count }, (_, i) => createMockIssue(`issue-${i + 1}`, `Issue ${i + 1}`));

describe('feedlog-issues-list', () => {
  it('should render all issues passed to it', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(5);
    await page.waitForChanges();

    const issueElements = page.root?.shadowRoot?.querySelectorAll('feedlog-issue');
    expect(issueElements?.length).toBe(5);
  });

  it('should render empty state when no issues', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = [];
    (page.root as HTMLFeedlogIssuesListElement).emptyStateTitle = 'No updates yet';
    (page.root as HTMLFeedlogIssuesListElement).emptyStateMessage = 'Check back later.';
    await page.waitForChanges();

    const emptyState = page.root?.shadowRoot?.querySelector('.empty-state-content');
    expect(emptyState).not.toBeNull();
    expect(emptyState?.querySelector('.empty-state-title')?.textContent).toBe('No updates yet');
  });

  it('should render fallback empty state without title/message', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = [];
    await page.waitForChanges();

    const emptyState = page.root?.shadowRoot?.querySelector('.empty-state');
    expect(emptyState?.querySelector('p')?.textContent).toBe('No issues found');
  });

  it('should not contain any pagination elements', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(50);
    await page.waitForChanges();

    const pagination = page.root?.shadowRoot?.querySelector('.pagination');
    expect(pagination).toBeNull();

    const issueElements = page.root?.shadowRoot?.querySelectorAll('feedlog-issue');
    expect(issueElements?.length).toBe(50);
  });

  it('should emit feedlogUpvote when child emits upvote', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(1);
    await page.waitForChanges();

    const spy = jest.fn();
    page.root?.addEventListener('feedlogUpvote', spy);

    const issueEl = page.root?.shadowRoot?.querySelector('feedlog-issue');
    issueEl?.dispatchEvent(
      new CustomEvent('feedlogUpvote', {
        detail: { issueId: 'issue-1', upvoted: true, upvoteCount: 1 },
        bubbles: true,
      })
    );

    expect(spy).toHaveBeenCalled();
  });
});
