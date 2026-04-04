import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

/**
 * Replaces `window.fetch` for `/api/issues` with offset-style pagination (same shape as e2e mock).
 * Storybook does not tear down between stories reliably; refresh the iframe if fetch behaves oddly.
 */
const TOTAL_ISSUES = 7;

function makeIssue(n: number) {
  return {
    id: `issue-${n}`,
    githubIssueLink: null,
    title: `Issue ${n}`,
    body: `Body ${n}`,
    type: 'enhancement' as const,
    status: 'open' as const,
    pinnedAt: null,
    revision: 1,
    repository: { id: 'repo-1', name: 'test-repo', description: null },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    upvoteCount: 0,
    hasUpvoted: false,
  };
}

let baselineFetch: typeof window.fetch | undefined;

function installOffsetApiFetchMock() {
  if (baselineFetch === undefined) {
    baselineFetch = window.fetch.bind(window);
  }

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof Request
          ? input.url
          : input instanceof URL
            ? input.href
            : String(input);
    if (!url.includes('/api/issues')) {
      return baselineFetch!(input as RequestInfo, init);
    }

    const u = new URL(url);
    const offset = Number(u.searchParams.get('offset') ?? '0');
    const limit = Math.min(100, Math.max(1, Number(u.searchParams.get('limit') ?? '10')));

    const issues: ReturnType<typeof makeIssue>[] = [];
    for (let i = 0; i < limit && offset + i < TOTAL_ISSUES; i++) {
      issues.push(makeIssue(offset + i + 1));
    }
    const nextOffset = offset + issues.length;
    const hasMore = nextOffset < TOTAL_ISSUES;

    return new Response(
      JSON.stringify({
        issues,
        pagination: {
          offset: hasMore ? nextOffset : null,
          hasMore,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };
}

const meta: Meta = {
  title: 'Components/Issues client',
  component: 'feedlog-issues-client',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**feedlog-issues-client** loads issues via `@feedlog-ai/core`. The “Load more (mocked offset API)” story patches `window.fetch` so you can exercise pagination without a real backend (same contract as `e2e/pagination-api-mock.spec.ts`).',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const LoadMoreWithMockedFetch: Story = {
  name: 'Load more (mocked offset API)',
  render: () => {
    installOffsetApiFetchMock();
    return (
      <div>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '1rem', maxWidth: '40rem' }}>
          <code>fetch</code> is mocked for URLs containing <code>/api/issues</code>. The next
          request should use <code>offset=…</code> (check Network). Use <strong>Load More</strong>{' '}
          until the button disappears.
        </p>
        <feedlog-issues-client
          apiKey="storybook-mock"
          endpoint="https://api.feedlog.app"
          limit={3}
          minSkeletonTime={0}
          heading="Mocked offset API"
        />
      </div>
    );
  },
};
