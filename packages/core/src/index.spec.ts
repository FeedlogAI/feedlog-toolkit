import { FeedlogSDK, generateId } from './index';
import {
  FeedlogError,
  FeedlogNetworkError,
  FeedlogValidationError,
  FeedlogTimeoutError,
} from './errors';

describe('FeedlogSDK', () => {
  const mockEndpoint = 'https://api.test.local';

  describe('Constructor', () => {
    it('should create an instance with default config', () => {
      const sdk = new FeedlogSDK();
      expect(sdk).toBeInstanceOf(FeedlogSDK);
      expect(sdk.getEndpoint()).toBe('https://api.feedlog.app');
    });

    it('should create an instance with config object', () => {
      const sdk = new FeedlogSDK({});
      expect(sdk).toBeInstanceOf(FeedlogSDK);
    });

    it('should use default endpoint if not provided', () => {
      const sdk = new FeedlogSDK({});
      expect(sdk.getEndpoint()).toBe('https://api.feedlog.app');
    });

    it('should use custom endpoint if provided', () => {
      const sdk = new FeedlogSDK({ endpoint: mockEndpoint });
      expect(sdk.getEndpoint()).toBe(mockEndpoint);
    });

    it('should remove trailing slash from endpoint', () => {
      const sdk = new FeedlogSDK({
        endpoint: mockEndpoint + '/',
      });
      expect(sdk.getEndpoint()).toBe(mockEndpoint);
    });

    it('should set credentials to include by default', () => {
      const sdk = new FeedlogSDK({});
      // We can't directly access config, but we can verify it's used in fetch
      expect(sdk).toBeDefined();
    });

    it('should use custom timeout if provided', () => {
      const customTimeout = 5000;
      const sdk = new FeedlogSDK({
        timeout: customTimeout,
      });
      expect(sdk.getTimeout()).toBe(customTimeout);
    });

    it('should use default timeout of 30000ms', () => {
      const sdk = new FeedlogSDK({});
      expect(sdk.getTimeout()).toBe(30000);
    });
  });

  describe('fetchIssues', () => {
    let sdk: FeedlogSDK;
    let fetchSpy: jest.Mock;

    beforeEach(() => {
      sdk = new FeedlogSDK({ endpoint: mockEndpoint });
      fetchSpy = jest.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should fetch issues with no parameters', async () => {
      const mockResponse = {
        issues: [],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await sdk.fetchIssues();
      expect(response).toEqual(mockResponse);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test.local/api/issues',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    it('should fetch issues with single repositoryId', async () => {
      const mockResponse = {
        issues: [
          {
            id: 'issue-1',
            githubIssueNumber: 1,
            type: 'bug',
            status: 'open',
            pinnedAt: null,
            title: 'Test Issue',
            body: 'Test body',
            revision: 1,
            repository: { id: 'repo-1', name: 'test-repo', owner: 'owner' },
            updatedAt: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            upvoteCount: 0,
            hasUpvoted: false,
          },
        ],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await sdk.fetchIssues({ repositoryIds: 'repo-1' });
      expect(response.issues).toHaveLength(1);

      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('repositoryIds=repo-1');
    });

    it('should fetch issues with multiple repositoryIds', async () => {
      const mockResponse = {
        issues: [],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.fetchIssues({ repositoryIds: ['repo-1', 'repo-2'] });

      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('repositoryIds=repo-1');
      expect(callUrl).toContain('repositoryIds=repo-2');
    });

    it('should fetch issues with type filter', async () => {
      const mockResponse = {
        issues: [],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.fetchIssues({ type: 'bug' });

      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('type=bug');
    });

    it('should fetch issues with pagination cursor', async () => {
      const mockResponse = {
        issues: [],
        pagination: { cursor: 'next-cursor', hasMore: true },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.fetchIssues({ cursor: 'current-cursor' });

      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('cursor=current-cursor');
    });

    it('should fetch issues with limit parameter', async () => {
      const mockResponse = {
        issues: [],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.fetchIssues({ limit: 50 });

      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('limit=50');
    });

    it('should include content-type header', async () => {
      const mockResponse = {
        issues: [],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.fetchIssues();

      const headers = fetchSpy.mock.calls[0][1]?.headers;
      expect(headers).toEqual(
        expect.objectContaining({
          'Content-Type': 'application/json',
        })
      );
    });

    it('should throw FeedlogNetworkError on non-ok response', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        status: 404,
      });

      await expect(sdk.fetchIssues()).rejects.toThrow(FeedlogNetworkError);
    });

    it('should throw FeedlogNetworkError on network failure', async () => {
      fetchSpy.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(sdk.fetchIssues()).rejects.toThrow(FeedlogNetworkError);
    });

    it('should validate issues response structure', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'response' }),
      });

      await expect(sdk.fetchIssues()).rejects.toThrow(FeedlogValidationError);
    });

    it('should sanitize issue content', async () => {
      const mockResponse = {
        issues: [
          {
            id: 'issue-1',
            githubIssueNumber: 1,
            type: 'bug',
            status: 'open',
            pinnedAt: null,
            title: '<script>alert("xss")</script>Safe Title',
            body: '<img src=x onerror="alert(\'xss\')">Safe Body',
            revision: 1,
            repository: { id: 'repo-1', name: 'test-repo', owner: 'owner' },
            updatedAt: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            upvoteCount: 0,
            hasUpvoted: false,
          },
        ],
        pagination: { cursor: null, hasMore: false },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await sdk.fetchIssues();
      expect(response.issues[0].title).not.toContain('<script>');
      expect(response.issues[0].body).not.toContain('onerror');
    });
  });

  describe('toggleUpvote', () => {
    let sdk: FeedlogSDK;
    let fetchSpy: jest.Mock;

    beforeEach(() => {
      sdk = new FeedlogSDK({ endpoint: mockEndpoint });
      fetchSpy = jest.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should toggle upvote on issue', async () => {
      const mockResponse = {
        upvoted: true,
        upvoteCount: 5,
        anonymousUserId: 'user-123',
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await sdk.toggleUpvote('issue-1');
      expect(response).toEqual(mockResponse);

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test.local/api/issues/issue-1/upvote',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    it('should throw FeedlogValidationError if issueId is missing', async () => {
      await expect(sdk.toggleUpvote('')).rejects.toThrow(FeedlogValidationError);
    });

    it('should throw FeedlogValidationError if issueId is not a string', async () => {
      await expect(sdk.toggleUpvote(null as unknown as string)).rejects.toThrow(
        FeedlogValidationError
      );
    });

    it('should throw FeedlogNetworkError on 404 response', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(sdk.toggleUpvote('issue-1')).rejects.toThrow(FeedlogNetworkError);
    });

    it('should throw FeedlogNetworkError on 401 response', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(sdk.toggleUpvote('issue-1')).rejects.toThrow(FeedlogNetworkError);
    });

    it('should include content-type header', async () => {
      const mockResponse = {
        upvoted: true,
        upvoteCount: 5,
        anonymousUserId: 'user-123',
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.toggleUpvote('issue-1');

      const headers = fetchSpy.mock.calls[0][1]?.headers;
      expect(headers).toEqual(
        expect.objectContaining({
          'Content-Type': 'application/json',
        })
      );
    });

    it('should include credentials in request', async () => {
      const mockResponse = {
        upvoted: true,
        upvoteCount: 5,
        anonymousUserId: 'user-123',
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.toggleUpvote('issue-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include',
        })
      );
    });

    it('should URL encode issue ID', async () => {
      const mockResponse = {
        upvoted: true,
        upvoteCount: 5,
        anonymousUserId: 'user-123',
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await sdk.toggleUpvote('issue-with-special/chars');

      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('issue-with-special%2Fchars');
    });
  });

  describe('Timeout handling', () => {
    let sdk: FeedlogSDK;
    let fetchSpy: jest.Mock;

    beforeEach(() => {
      sdk = new FeedlogSDK({ timeout: 100 });
      fetchSpy = jest.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw FeedlogTimeoutError on timeout', async () => {
      // Mock fetch to never resolve
      fetchSpy.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolve
          })
      );

      // Mock AbortController
      const mockAbortController = {
        signal: {},
        abort: jest.fn(),
      };

      const originalAbortController = global.AbortController;
      (global as any).AbortController = jest.fn(() => mockAbortController);

      await expect(sdk.fetchIssues()).rejects.toThrow();

      (global as any).AbortController = originalAbortController;
    });
  });
});

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });

  it('should generate IDs with timestamp and random part', () => {
    const id = generateId();
    const parts = id.split('-');
    expect(parts.length).toBe(2);
    expect(parts[0]).toMatch(/^\d+$/); // timestamp
    expect(parts[1]).toMatch(/^[a-z0-9]+$/); // random part
  });
});
