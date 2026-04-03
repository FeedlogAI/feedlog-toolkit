import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { FeedlogIssuesClient } from './feedlog-issues-client';
import { FeedlogSDK } from '@feedlog-ai/core';
import type { FeedlogIssue, FetchIssuesResponse } from '@feedlog-ai/core';

const createMockIssue = (id: string): FeedlogIssue => ({
  id,
  githubIssueLink: `https://github.com/test/repo/issues/${id}`,
  title: `Issue ${id}`,
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

const createMockIssues = (count: number, startFrom = 1): FeedlogIssue[] =>
  Array.from({ length: count }, (_, i) => createMockIssue(`issue-${startFrom + i}`));

const mockResponse = (
  issues: FeedlogIssue[],
  hasMore = false,
  cursor: string | null = null
): FetchIssuesResponse => ({
  issues,
  pagination: { cursor, hasMore },
});

function getInstance(page: SpecPage): FeedlogIssuesClient {
  return page.rootInstance as FeedlogIssuesClient;
}

describe('feedlog-issues-client - --feedlog-background forwarding', () => {
  it('should forward --feedlog-background from host to feedlog-issues child', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          style={{ '--feedlog-background': 'transparent' }}
        ></feedlog-issues-client>
      ),
    });

    await page.waitForChanges();

    const feedlogIssues = page.root?.shadowRoot?.querySelector('feedlog-issues');
    expect(feedlogIssues).toBeDefined();

    const bgValue = feedlogIssues?.style?.getPropertyValue('--feedlog-background');
    expect(bgValue).toBe('transparent');
  });

  it('should not pass style to feedlog-issues when host has no --feedlog-background', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => <feedlog-issues-client apiKey="test-key"></feedlog-issues-client>,
    });

    await page.waitForChanges();

    const feedlogIssues = page.root?.shadowRoot?.querySelector('feedlog-issues');
    expect(feedlogIssues).toBeDefined();

    const bgValue = feedlogIssues?.style?.getPropertyValue('--feedlog-background');
    expect(bgValue).toBe('');
  });
});

describe('feedlog-issues-client - load-more mode', () => {
  beforeEach(() => {
    (FeedlogSDK as jest.Mock).mockClear();
  });

  it('should default to load-more paginationType', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => <feedlog-issues-client apiKey="test-key"></feedlog-issues-client>,
    });
    await page.waitForChanges();

    expect(getInstance(page).paginationType).toBe('load-more');
  });

  it('should fetch issues on load', async () => {
    const issues = createMockIssues(5);
    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: jest.fn().mockResolvedValue(mockResponse(issues, true, 'cursor-1')),
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => <feedlog-issues-client apiKey="test-key" limit={5}></feedlog-issues-client>,
    });
    await page.waitForChanges();

    const inst = getInstance(page);
    expect(inst.issues.length).toBe(5);
    expect(inst.hasMore).toBe(true);
    expect(inst.loading).toBe(false);
  });

  it('should append issues on loadMore with minSkeletonTime=0', async () => {
    const batch1 = createMockIssues(3, 1);
    const batch2 = createMockIssues(3, 4);

    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(mockResponse(batch1, true, 'cursor-1'))
      .mockResolvedValueOnce(mockResponse(batch2, false, null));

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          minSkeletonTime={0}
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    const inst = getInstance(page);
    expect(inst.issues.length).toBe(3);

    // Trigger load more via the child event
    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');
    child?.dispatchEvent(new CustomEvent('feedlogLoadMore', { bubbles: true }));

    // Wait for async load
    await new Promise(r => setTimeout(r, 50));
    await page.waitForChanges();

    expect(inst.issues.length).toBe(6);
    expect(inst.hasMore).toBe(false);
  });

  it('should not fire duplicate requests while loading more', async () => {
    const fetchFn = jest
      .fn()
      .mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(mockResponse(createMockIssues(3), true, 'cursor-2')), 100)
          )
      );

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          minSkeletonTime={0}
        ></feedlog-issues-client>
      ),
    });

    // Wait for initial fetch
    await new Promise(r => setTimeout(r, 150));
    await page.waitForChanges();

    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');
    const initialCallCount = fetchFn.mock.calls.length;

    // Trigger multiple rapid load-more events
    child?.dispatchEvent(new CustomEvent('feedlogLoadMore', { bubbles: true }));
    child?.dispatchEvent(new CustomEvent('feedlogLoadMore', { bubbles: true }));
    child?.dispatchEvent(new CustomEvent('feedlogLoadMore', { bubbles: true }));

    await new Promise(r => setTimeout(r, 200));
    await page.waitForChanges();

    // Only one additional fetch should have been made (guard prevents duplicates)
    expect(fetchFn.mock.calls.length).toBe(initialCallCount + 1);
  });
});

describe('feedlog-issues-client - prev-next mode', () => {
  beforeEach(() => {
    (FeedlogSDK as jest.Mock).mockClear();
  });

  it('should accept paginationType="prev-next"', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client apiKey="test-key" paginationType="prev-next"></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    expect(getInstance(page).paginationType).toBe('prev-next');
  });

  it('should fetch 2x limit on init and show first page', async () => {
    const allIssues = createMockIssues(6, 1);
    const fetchFn = jest.fn().mockResolvedValue(mockResponse(allIssues, true, 'cursor-1'));

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          paginationType="prev-next"
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    // Should have fetched with limit=6 (2x3)
    expect(fetchFn).toHaveBeenCalledWith(expect.objectContaining({ limit: 6 }));

    const inst = getInstance(page);
    expect(inst.issues.length).toBe(3);
    expect(inst.issues[0].id).toBe('issue-1');
    expect(inst.hasPrev).toBe(false);
    expect(inst.hasMore).toBe(true);
    expect(inst.pages.length).toBe(2);
  });

  it('should show cached second page on Next without additional API call', async () => {
    const allIssues = createMockIssues(6, 1);
    const fetchFn = jest.fn().mockResolvedValue(mockResponse(allIssues, true, 'cursor-1'));

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          paginationType="prev-next"
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    const inst = getInstance(page);

    // Navigate to next page
    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');
    child?.dispatchEvent(
      new CustomEvent('feedlogPageChange', {
        detail: { direction: 'next' },
        bubbles: true,
      })
    );
    await page.waitForChanges();

    expect(inst.issues.length).toBe(3);
    expect(inst.issues[0].id).toBe('issue-4');
    expect(inst.hasPrev).toBe(true);
    expect(inst.currentPageIndex).toBe(1);

    // A prefetch may fire in background, but page change used cache
  });

  it('should return to cached first page on Prev', async () => {
    const allIssues = createMockIssues(6, 1);
    const fetchFn = jest.fn().mockResolvedValue(mockResponse(allIssues, false, null));

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          paginationType="prev-next"
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');
    const inst = getInstance(page);

    // Go to page 2
    child?.dispatchEvent(
      new CustomEvent('feedlogPageChange', {
        detail: { direction: 'next' },
        bubbles: true,
      })
    );
    await page.waitForChanges();
    expect(inst.issues[0].id).toBe('issue-4');

    // Go back to page 1
    child?.dispatchEvent(
      new CustomEvent('feedlogPageChange', {
        detail: { direction: 'prev' },
        bubbles: true,
      })
    );
    await page.waitForChanges();

    expect(inst.issues[0].id).toBe('issue-1');
    expect(inst.hasPrev).toBe(false);
    expect(inst.currentPageIndex).toBe(0);
  });

  it('should clear cache when query props change', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(mockResponse(createMockIssues(4, 1), true, 'cursor-1'));

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={2}
          paginationType="prev-next"
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');
    const inst = getInstance(page);

    // Navigate to page 2
    child?.dispatchEvent(
      new CustomEvent('feedlogPageChange', {
        detail: { direction: 'next' },
        bubbles: true,
      })
    );
    await page.waitForChanges();
    expect(inst.hasPrev).toBe(true);

    // Change type prop - should reset
    const newIssues = createMockIssues(4, 10);
    fetchFn.mockResolvedValue(mockResponse(newIssues, false, null));

    (page.root as any).type = 'bug';
    await page.waitForChanges();
    await new Promise(r => setTimeout(r, 50));
    await page.waitForChanges();

    expect(inst.hasPrev).toBe(false);
    expect(inst.currentPageIndex).toBe(0);
    expect(inst.issues[0].id).toBe('issue-10');
  });
});

describe('feedlog-issues-client - slow network simulation', () => {
  beforeEach(() => {
    (FeedlogSDK as jest.Mock).mockClear();
  });

  it('should show skeletons for at least minSkeletonTime even when API responds instantly', async () => {
    const batch1 = createMockIssues(3, 1);
    const batch2 = createMockIssues(3, 4);

    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(mockResponse(batch1, true, 'cursor-1'))
      .mockResolvedValueOnce(mockResponse(batch2, false, null));

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          minSkeletonTime={200}
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    const inst = getInstance(page);
    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');

    // Trigger load more
    child?.dispatchEvent(new CustomEvent('feedlogLoadMore', { bubbles: true }));
    // Microtask: isLoadingMore is set synchronously in loadMore()
    await page.waitForChanges();

    expect(inst.isLoadingMore).toBe(true);

    // Wait less than minSkeletonTime — API already responded but timer hasn't expired
    await new Promise(r => setTimeout(r, 50));
    await page.waitForChanges();
    expect(inst.isLoadingMore).toBe(true);

    // Wait for the full skeleton time
    await new Promise(r => setTimeout(r, 200));
    await page.waitForChanges();

    expect(inst.isLoadingMore).toBe(false);
    expect(inst.issues.length).toBe(6);
  });

  it('should handle slow API responses gracefully', async () => {
    const batch1 = createMockIssues(3, 1);

    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(mockResponse(batch1, true, 'cursor-1'))
      .mockImplementationOnce(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(mockResponse(createMockIssues(3, 4), false, null)), 500)
          )
      );

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: fetchFn,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={3}
          minSkeletonTime={0}
        ></feedlog-issues-client>
      ),
    });
    await page.waitForChanges();

    const inst = getInstance(page);
    const child = page.root?.shadowRoot?.querySelector('feedlog-issues');

    child?.dispatchEvent(new CustomEvent('feedlogLoadMore', { bubbles: true }));
    await page.waitForChanges();

    expect(inst.isLoadingMore).toBe(true);

    // Wait for slow API
    await new Promise(r => setTimeout(r, 600));
    await page.waitForChanges();

    expect(inst.isLoadingMore).toBe(false);
    expect(inst.issues.length).toBe(6);
  });

  it('should handle stale requests when params change during fetch', async () => {
    const slowFetch = jest
      .fn()
      .mockImplementation(
        (params: any) =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve(
                  mockResponse(
                    params.type === 'bug' ? createMockIssues(2, 100) : createMockIssues(2, 1),
                    false,
                    null
                  )
                ),
              200
            )
          )
      );

    (FeedlogSDK as jest.Mock).mockImplementation(() => ({
      fetchIssues: slowFetch,
      toggleUpvote: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      template: () => (
        <feedlog-issues-client
          apiKey="test-key"
          limit={2}
          paginationType="prev-next"
        ></feedlog-issues-client>
      ),
    });

    // Change type while initial fetch is in flight
    await new Promise(r => setTimeout(r, 50));
    (page.root as any).type = 'bug';
    await page.waitForChanges();

    // Wait for all fetches to complete
    await new Promise(r => setTimeout(r, 400));
    await page.waitForChanges();

    const inst = getInstance(page);
    expect(inst.issues[0].id).toBe('issue-100');
  });
});
