import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:3001';
const PAGE_URL = `${BASE}/pagination-client`;

const TOTAL_ISSUES = 7;
const PAGE_SIZE = 3;

function makeIssue(n: number) {
  return {
    id: `issue-${n}`,
    githubIssueLink: null,
    title: `Issue ${n}`,
    body: `Body ${n}`,
    type: 'enhancement',
    status: 'open',
    pinnedAt: null,
    revision: 1,
    repository: { id: 'repo-1', name: 'test-repo', description: null },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    upvoteCount: 0,
    hasUpvoted: false,
  };
}

/**
 * Mimics an offset-based Feedlog-style API: `pagination.offset` is the next offset to request.
 */
function issuesJsonForRequest(url: URL): string {
  const offset = Number(url.searchParams.get('offset') ?? '0');
  const rawLimit = url.searchParams.get('limit');
  const limit = Math.min(
    100,
    Math.max(1, rawLimit != null && rawLimit !== '' ? Number(rawLimit) : PAGE_SIZE)
  );

  const issues: ReturnType<typeof makeIssue>[] = [];
  for (let i = 0; i < limit && offset + i < TOTAL_ISSUES; i++) {
    issues.push(makeIssue(offset + i + 1));
  }

  const nextOffset = offset + issues.length;
  const hasMore = nextOffset < TOTAL_ISSUES;

  return JSON.stringify({
    issues,
    pagination: {
      offset: hasMore ? nextOffset : null,
      hasMore,
    },
  });
}

test.describe('Pagination — mocked API (offset)', () => {
  test('records increasing offset on each fetch', async ({ page }) => {
    const seen: string[] = [];

    await page.route('**/api/issues**', async route => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      const url = new URL(route.request().url());
      seen.push(url.search);
      const body = issuesJsonForRequest(url);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body,
      });
    });

    await page.goto(PAGE_URL);

    const widget = page.locator('#client-widget');
    await expect(widget).toBeVisible();
    await expect(widget).toContainText('Issue 1');
    await expect(widget).toContainText('Issue 3');

    const loadMore = widget.locator('text=Load More');
    await loadMore.click();
    await expect(widget.locator('.skeleton-card').first()).not.toBeVisible({ timeout: 10000 });
    await expect(widget).toContainText('Issue 4');

    await loadMore.click();
    await expect(widget.locator('.skeleton-card').first()).not.toBeVisible({ timeout: 10000 });
    await expect(widget).toContainText('Issue 7');

    await expect(loadMore).not.toBeVisible();

    expect(seen.length).toBe(3);
    // First page: no cursor yet — request should not include offset (only limit)
    expect(seen[0]).not.toMatch(/[?&]offset=/);
    expect(seen[1]).toMatch(/[?&]offset=3(&|$)/);
    expect(seen[2]).toMatch(/[?&]offset=6(&|$)/);
  });

  test('does not send cursor= for numeric next token', async ({ page }) => {
    const urls: string[] = [];

    await page.route('**/api/issues**', async route => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      urls.push(route.request().url());
      const url = new URL(route.request().url());
      const body = issuesJsonForRequest(url);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body,
      });
    });

    await page.goto(PAGE_URL);
    await page.locator('#client-widget').getByText('Load More').click();
    await expect(page.locator('#client-widget').locator('.skeleton-card').first()).not.toBeVisible({
      timeout: 10000,
    });

    for (const u of urls) {
      expect(u).not.toMatch(/cursor=/);
    }
    expect(urls.some(u => u.includes('offset=3'))).toBe(true);
  });
});
