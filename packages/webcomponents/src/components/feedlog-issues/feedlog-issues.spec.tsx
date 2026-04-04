import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import type { FeedlogIssue } from '@feedlog-ai/core';
import { FeedlogIssues } from './feedlog-issues';

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

describe('feedlog-issues - load-more mode', () => {
  it('should render Load More button when hasMore is true', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          paginationType="load-more"
        ></feedlog-issues>
      ),
    });

    const btn = page.root?.shadowRoot?.querySelector('.load-more-container feedlog-button');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toContain('Load More');
  });

  it('should use custom loadMoreLabel when set', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          paginationType="load-more"
          loadMoreLabel="Show more updates"
        ></feedlog-issues>
      ),
    });

    const btn = page.root?.shadowRoot?.querySelector('.load-more-container feedlog-button');
    expect(btn?.textContent).toContain('Show more updates');
  });

  it('should hide Load More button when hasMore is false', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={false}
          paginationType="load-more"
        ></feedlog-issues>
      ),
    });

    const btn = page.root?.shadowRoot?.querySelector('.load-more-container');
    expect(btn).toBeNull();
  });

  it('should show skeleton cards when isLoadingMore is true', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          isLoadingMore={true}
          limit={3}
          paginationType="load-more"
        ></feedlog-issues>
      ),
    });

    const skeletons = page.root?.shadowRoot?.querySelectorAll(
      '.load-more-skeletons .skeleton-card'
    );
    expect(skeletons?.length).toBe(3);
  });

  it('should hide Load More button while showing skeletons', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          isLoadingMore={true}
          limit={3}
          paginationType="load-more"
        ></feedlog-issues>
      ),
    });

    const btn = page.root?.shadowRoot?.querySelector('.load-more-container');
    expect(btn).toBeNull();

    const skeletons = page.root?.shadowRoot?.querySelector('.load-more-skeletons');
    expect(skeletons).not.toBeNull();
  });

  it('should emit feedlogLoadMore when button is clicked', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          paginationType="load-more"
        ></feedlog-issues>
      ),
    });

    const spy = jest.fn();
    page.root?.addEventListener('feedlogLoadMore', spy);

    const btn = page.root?.shadowRoot?.querySelector('feedlog-button');
    btn?.dispatchEvent(new CustomEvent('feedlogClick', { bubbles: true }));

    expect(spy).toHaveBeenCalled();
  });

  it('should default skeleton count to 3 when limit is not set', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          isLoadingMore={true}
          paginationType="load-more"
        ></feedlog-issues>
      ),
    });

    const skeletons = page.root?.shadowRoot?.querySelectorAll(
      '.load-more-skeletons .skeleton-card'
    );
    expect(skeletons?.length).toBe(3);
  });
});

describe('feedlog-issues - prev-next mode', () => {
  it('should render Prev and Next arrow buttons', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          hasPrev={false}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const prevBtn = page.root?.shadowRoot?.querySelector('button[aria-label="Previous page"]');
    const nextBtn = page.root?.shadowRoot?.querySelector('button[aria-label="Next page"]');
    expect(prevBtn).not.toBeNull();
    expect(nextBtn).not.toBeNull();
  });

  it('should disable Prev when hasPrev is false', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          hasPrev={false}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const prevBtn = page.root?.shadowRoot?.querySelector(
      'button[aria-label="Previous page"]'
    ) as HTMLButtonElement;
    expect(prevBtn?.hasAttribute('disabled')).toBe(true);
  });

  it('should disable Next when hasMore is false', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={false}
          hasPrev={true}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const nextBtn = page.root?.shadowRoot?.querySelector(
      'button[aria-label="Next page"]'
    ) as HTMLButtonElement;
    expect(nextBtn?.hasAttribute('disabled')).toBe(true);
  });

  it('should emit feedlogPageChange with direction "next" on Next click', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          hasPrev={false}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const spy = jest.fn();
    page.root?.addEventListener('feedlogPageChange', spy);

    const nextBtn = page.root?.shadowRoot?.querySelector(
      'button[aria-label="Next page"]'
    ) as HTMLButtonElement;
    nextBtn?.click();

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ direction: 'next' });
  });

  it('should emit feedlogPageChange with direction "prev" on Prev click', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          hasPrev={true}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const spy = jest.fn();
    page.root?.addEventListener('feedlogPageChange', spy);

    const prevBtn = page.root?.shadowRoot?.querySelector(
      'button[aria-label="Previous page"]'
    ) as HTMLButtonElement;
    prevBtn?.click();

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ direction: 'prev' });
  });

  it('should not render pagination nav when both hasPrev and hasMore are false', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={false}
          hasPrev={false}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const nav = page.root?.shadowRoot?.querySelector('.pagination');
    expect(nav).toBeNull();
  });

  it('should not render any numbered page buttons', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => (
        <feedlog-issues
          issues={createMockIssues(5)}
          hasMore={true}
          hasPrev={true}
          paginationType="prev-next"
        ></feedlog-issues>
      ),
    });

    const allButtons = page.root?.shadowRoot?.querySelectorAll('.pagination button');
    expect(allButtons?.length).toBe(2);
  });
});

describe('feedlog-issues - loading and error states', () => {
  it('should show loading skeletons when loading is true', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => <feedlog-issues loading={true}></feedlog-issues>,
    });

    const skeletons = page.root?.shadowRoot?.querySelectorAll('.loading-state .skeleton-card');
    expect(skeletons?.length).toBe(3);
  });

  it('should show error state when error is set', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => <feedlog-issues error="Something broke"></feedlog-issues>,
    });

    const errorState = page.root?.shadowRoot?.querySelector('.error-state');
    expect(errorState).not.toBeNull();
    expect(errorState?.querySelector('.error-state-message')?.textContent).toBe('Something broke');
  });

  it('should default to load-more paginationType', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssues],
      template: () => <feedlog-issues issues={createMockIssues(5)} hasMore={true}></feedlog-issues>,
    });

    const btn = page.root?.shadowRoot?.querySelector('.load-more-container feedlog-button');
    expect(btn).not.toBeNull();

    const nav = page.root?.shadowRoot?.querySelector('.pagination');
    expect(nav).toBeNull();
  });
});
