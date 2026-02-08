/**
 * Core SDK for Feedlog Toolkit
 *
 * This package provides the core functionality and utilities
 * used across all Feedlog Toolkit packages.
 */

export * from './types';

export * from './utils';

export * from './errors';

import {
  FeedlogSDKConfig,
  FetchIssuesParams,
  FetchIssuesResponse,
  UpvoteResponse,
  FeedlogIssue,
} from './types';
import { sanitizeHtml } from './utils';
import {
  FeedlogError,
  FeedlogNetworkError,
  FeedlogTimeoutError,
  FeedlogValidationError,
} from './errors';

/**
 * Main Feedlog SDK class
 * Provides methods to interact with the Feedlog API
 */
export class FeedlogSDK {
  private config: FeedlogSDKConfig;
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  constructor(config: FeedlogSDKConfig) {
    this.config = {
      credentials: 'include',
      ...config,
    };

    this.apiKey = this.config.apiKey;
    if (!this.apiKey) {
      throw new FeedlogValidationError('apiKey is required in FeedlogSDKConfig');
    }
    this.endpoint = this.config.endpoint || 'https://api.feedlog.app';
    this.timeout = this.config.timeout || 30000;

    // Ensure endpoint doesn't have trailing slash
    this.endpoint = this.endpoint.replace(/\/$/, '');
  }

  /**
   * Fetch issues from the API
   * Supports filtering by repository IDs, type, pagination, and limit
   */
  async fetchIssues(params: FetchIssuesParams = {}): Promise<FetchIssuesResponse> {
    try {
      const url = this.buildIssuesUrl(params);
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: this.config.credentials || 'include',
      });

      if (!response.ok) {
        throw new FeedlogNetworkError(
          `Failed to fetch issues: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return this.validateIssuesResponse(data);
    } catch (error) {
      if (error instanceof FeedlogError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new FeedlogNetworkError('Network error: Unable to reach API', undefined, error);
      }

      throw new FeedlogError(
        `Failed to fetch issues: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Toggle upvote on an issue
   * Adds upvote if not already upvoted, removes if already upvoted
   */
  async toggleUpvote(issueId: string): Promise<UpvoteResponse> {
    if (!issueId || typeof issueId !== 'string') {
      throw new FeedlogValidationError('Issue ID is required');
    }

    try {
      const url = `${this.endpoint}/api/issues/${encodeURIComponent(issueId)}/upvote`;
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: this.config.credentials || 'include',
        body: JSON.stringify({}),
      });

      if (response.status === 404) {
        throw new FeedlogNetworkError('Issue not found', 404);
      }

      if (response.status === 401) {
        throw new FeedlogNetworkError('Unauthorized', 401);
      }

      if (response.status === 403) {
        throw new FeedlogNetworkError('Forbidden: Domain not allowed for this repository', 403);
      }

      if (!response.ok) {
        throw new FeedlogNetworkError(
          `Failed to toggle upvote: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return this.validateUpvoteResponse(data);
    } catch (error) {
      if (error instanceof FeedlogError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new FeedlogNetworkError('Network error: Unable to reach API', undefined, error);
      }

      throw new FeedlogError(
        `Failed to toggle upvote: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Build the full URL for fetching issues with query parameters
   */
  private buildIssuesUrl(params: FetchIssuesParams): string {
    const url = new URL(`${this.endpoint}/api/issues`);

    // Handle repositoryIds - can be single string or array
    if (params.repositoryIds) {
      const ids = Array.isArray(params.repositoryIds)
        ? params.repositoryIds
        : [params.repositoryIds];

      for (const id of ids) {
        url.searchParams.append('repositoryIds', id);
      }
    }

    if (params.type) {
      url.searchParams.set('type', params.type);
    }

    if (params.sortBy) {
      url.searchParams.set('sortBy', params.sortBy);
    }

    if (params.cursor) {
      url.searchParams.set('cursor', params.cursor);
    }

    if (params.limit !== undefined) {
      url.searchParams.set('limit', params.limit.toString());
    }

    return url.toString();
  }

  /**
   * Get request headers
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    return headers;
  }

  /**
   * Fetch with timeout support using AbortController
   */
  private async fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new FeedlogTimeoutError(`Request timed out after ${this.timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Validate and sanitize issues response
   */
  private validateIssuesResponse(data: unknown): FetchIssuesResponse {
    if (!data || typeof data !== 'object') {
      throw new FeedlogValidationError('Invalid API response: expected object');
    }

    const response = data as Record<string, unknown>;

    if (!Array.isArray(response.issues)) {
      throw new FeedlogValidationError('Invalid API response: issues must be an array');
    }

    if (!response.pagination || typeof response.pagination !== 'object') {
      throw new FeedlogValidationError('Invalid API response: pagination is required');
    }

    const issues = (response.issues as unknown[]).map(issue => this.validateIssue(issue));

    return {
      issues,
      pagination: {
        cursor: (response.pagination as Record<string, unknown>).cursor as string | null,
        hasMore: Boolean((response.pagination as Record<string, unknown>).hasMore),
      },
    };
  }

  /**
   * Validate and sanitize an individual issue
   */
  private validateIssue(data: unknown): FeedlogIssue {
    if (!data || typeof data !== 'object') {
      throw new FeedlogValidationError('Invalid issue: expected object');
    }

    const issue = data as Record<string, unknown>;

    // Validate required fields
    if (typeof issue.id !== 'string') {
      throw new FeedlogValidationError('Invalid issue: id is required and must be a string');
    }

    if (typeof issue.title !== 'string') {
      throw new FeedlogValidationError('Invalid issue: title is required and must be a string');
    }

    if (!['bug', 'enhancement'].includes(String(issue.type))) {
      throw new FeedlogValidationError('Invalid issue: type must be "bug" or "enhancement"');
    }

    if (!['open', 'closed'].includes(String(issue.status))) {
      throw new FeedlogValidationError('Invalid issue: status must be "open" or "closed"');
    }

    if (!issue.repository || typeof issue.repository !== 'object') {
      throw new FeedlogValidationError('Invalid issue: repository is required');
    }

    const repo = issue.repository as Record<string, unknown>;
    if (
      typeof repo.id !== 'string' ||
      typeof repo.name !== 'string' ||
      typeof repo.owner !== 'string'
    ) {
      throw new FeedlogValidationError('Invalid issue: repository must have id, name, and owner');
    }

    // Sanitize string fields to prevent XSS
    const sanitizedTitle = sanitizeHtml(String(issue.title));
    const sanitizedBody = sanitizeHtml(String(issue.body || ''));

    return {
      id: String(issue.id),
      type: (issue.type as 'bug' | 'enhancement') || 'bug',
      status: (issue.status as 'open' | 'closed') || 'open',
      pinnedAt: issue.pinnedAt ? String(issue.pinnedAt) : null,
      revision: Number(issue.revision) || 1,
      title: sanitizedTitle,
      body: sanitizedBody,
      repository: {
        id: String(repo.id),
        name: String(repo.name),
        owner: String(repo.owner),
      },
      updatedAt: String(issue.updatedAt) || new Date().toISOString(),
      createdAt: String(issue.createdAt) || new Date().toISOString(),
      upvoteCount: Number(issue.upvoteCount) || 0,
      hasUpvoted: Boolean(issue.hasUpvoted),
    };
  }

  /**
   * Validate upvote response
   */
  private validateUpvoteResponse(data: unknown): UpvoteResponse {
    if (!data || typeof data !== 'object') {
      throw new FeedlogValidationError('Invalid upvote response: expected object');
    }

    const response = data as Record<string, unknown>;

    if (typeof response.upvoted !== 'boolean') {
      throw new FeedlogValidationError('Invalid upvote response: upvoted must be a boolean');
    }

    if (typeof response.upvoteCount !== 'number') {
      throw new FeedlogValidationError('Invalid upvote response: upvoteCount must be a number');
    }

    if (typeof response.anonymousUserId !== 'string') {
      throw new FeedlogValidationError('Invalid upvote response: anonymousUserId must be a string');
    }

    return {
      upvoted: response.upvoted,
      upvoteCount: response.upvoteCount,
      anonymousUserId: response.anonymousUserId,
    };
  }

  /**
   * Get the current endpoint
   */
  getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * Get the current timeout setting
   */
  getTimeout(): number {
    return this.timeout;
  }
}
