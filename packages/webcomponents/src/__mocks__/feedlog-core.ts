/**
 * Mock for @feedlog-ai/core used in tests.
 * Mapped via Stencil testing config moduleNameMapper to avoid CI resolution issues.
 */
export const FeedlogSDK = jest.fn().mockImplementation(() => ({
  fetchIssues: jest
    .fn()
    .mockResolvedValue({ issues: [], pagination: { cursor: null, hasMore: false } }),
  toggleUpvote: jest.fn(),
}));
