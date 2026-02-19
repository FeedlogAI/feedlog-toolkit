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

describe('feedlog-issues-list - Pagination', () => {
  it('should hide pagination when issues.length <= limit', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(5);
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const pagination = page.root?.shadowRoot?.querySelector('.pagination');
    expect(pagination).toBeNull();
  });

  it('should show pagination when issues.length > limit', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(50);
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const pagination = page.root?.shadowRoot?.querySelector('.pagination');
    expect(pagination).not.toBeNull();
  });

  it('should display first page of issues (limit items) when paginated', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    const issues = createMockIssues(50);
    (page.root as HTMLFeedlogIssuesListElement).issues = issues;
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const issueElements = page.root?.shadowRoot?.querySelectorAll('feedlog-issue');
    expect(issueElements?.length).toBe(10);
  });

  it('should display correct page numbers: first, last, 3 around current, arrows', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(200);
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const pagination = page.root?.shadowRoot?.querySelector('.pagination');
    expect(pagination).not.toBeNull();

    const prevBtn = pagination?.querySelector(
      'button[aria-label="Previous page"]'
    ) as HTMLButtonElement;
    const nextBtn = pagination?.querySelector(
      'button[aria-label="Next page"]'
    ) as HTMLButtonElement;
    expect(prevBtn).toBeDefined();
    expect(nextBtn).toBeDefined();

    const pageButtons = pagination?.querySelectorAll(
      'button.pagination-btn:not(.pagination-arrow)'
    );
    const pageNumbers = Array.from(pageButtons || []).map(b => b.textContent?.trim());
    expect(pageNumbers).toContain('1');
    expect(pageNumbers).toContain('20');
    expect(pageNumbers.some(n => n === '1' || n === '2' || n === '3')).toBe(true);
  });

  it('should disable Prev on page 1 and disable Next on last page', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    (page.root as HTMLFeedlogIssuesListElement).issues = createMockIssues(50);
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const pagination = page.root?.shadowRoot?.querySelector('.pagination');
    const prevBtn = pagination?.querySelector(
      'button[aria-label="Previous page"]'
    ) as HTMLButtonElement;
    const nextBtn = pagination?.querySelector(
      'button[aria-label="Next page"]'
    ) as HTMLButtonElement;

    expect(prevBtn).toBeDefined();
    expect(prevBtn?.hasAttribute('disabled')).toBe(true);
    expect(nextBtn).toBeDefined();
    expect(nextBtn?.hasAttribute('disabled')).toBe(false);

    nextBtn?.click();
    await page.waitForChanges();
    nextBtn?.click();
    await page.waitForChanges();
    nextBtn?.click();
    await page.waitForChanges();
    nextBtn?.click();
    await page.waitForChanges();

    const prevBtnAfter = pagination?.querySelector(
      'button[aria-label="Previous page"]'
    ) as HTMLButtonElement;
    const nextBtnAfter = pagination?.querySelector(
      'button[aria-label="Next page"]'
    ) as HTMLButtonElement;
    expect(prevBtnAfter?.hasAttribute('disabled')).toBe(false);
    expect(nextBtnAfter?.hasAttribute('disabled')).toBe(true);
  });

  it('should change displayed issues when clicking Next', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    const issues = createMockIssues(50);
    (page.root as HTMLFeedlogIssuesListElement).issues = issues;
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const firstPageFirstId = (page.root?.shadowRoot?.querySelector('feedlog-issue') as any)?.issue
      ?.id;
    expect(firstPageFirstId).toBe('issue-1');

    const nextBtn = page.root?.shadowRoot?.querySelector(
      'button[aria-label="Next page"]'
    ) as HTMLButtonElement;
    nextBtn?.click();
    await page.waitForChanges();

    const secondPageFirstId = (page.root?.shadowRoot?.querySelector('feedlog-issue') as any)?.issue
      ?.id;
    expect(secondPageFirstId).toBe('issue-11');
  });

  it('should change displayed issues when clicking a page number', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesList],
      html: '<feedlog-issues-list></feedlog-issues-list>',
    });

    const issues = createMockIssues(50);
    (page.root as HTMLFeedlogIssuesListElement).issues = issues;
    (page.root as HTMLFeedlogIssuesListElement).limit = 10;
    await page.waitForChanges();

    const page2Button = Array.from(
      page.root?.shadowRoot?.querySelectorAll('button.pagination-btn') || []
    ).find(b => b.textContent?.trim() === '2') as HTMLButtonElement | undefined;
    page2Button?.click();
    await page.waitForChanges();

    const displayedFirstId = (page.root?.shadowRoot?.querySelector('feedlog-issue') as any)?.issue
      ?.id;
    expect(displayedFirstId).toBe('issue-11');
  });
});
