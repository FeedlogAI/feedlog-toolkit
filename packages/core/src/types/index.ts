/**
 * Core types for Feedlog Toolkit
 */

/**
 * Issue status values
 */
export type IssueStatus = 'open' | 'in_progress' | 'closed';

/**
 * Repository information embedded in issue responses.
 * Uses public-facing metadata (name/description) instead of internal GitHub details.
 * Both name and description may be null.
 */
export interface Repository {
  id: string;
  /** Public display name (user-configurable). May be null. */
  name: string | null;
  /** User-configurable description. May be null. */
  description: string | null;
}

/**
 * Issue type matching new API response schema
 */
export interface FeedlogIssue {
  id: string; // Public issue ID
  /** GitHub issue URL, or null for private repositories (privacy) */
  githubIssueLink: string | null;
  type: 'bug' | 'enhancement';
  status: IssueStatus;
  pinnedAt: string | null; // ISO 8601 timestamp or null
  /** May be null — display fallback (e.g. "Untitled") when null */
  title: string | null;
  /** May be null — when present, use as tooltip for the title/name */
  body: string | null; // Markdown content
  revision: number;
  repository: Repository;
  updatedAt: string; // ISO 8601 timestamp
  createdAt: string; // ISO 8601 timestamp
  upvoteCount: number;
  hasUpvoted: boolean; // Whether current user has upvoted
}

/**
 * Callback to resolve GitHub issue URL when githubIssueLink is not available.
 * Required because repository.owner was removed from the API for privacy.
 */
export type GetIssueUrlFn = (issue: FeedlogIssue) => string | null | undefined;

/**
 * Accepted values for sorting issues
 */
export type SortBy = 'createdAt' | 'updatedAt';

/**
 * Parameters for fetching issues
 */
export interface FetchIssuesParams {
  repositoryIds?: string | string[]; // Single ID or array of IDs
  type?: 'bug' | 'enhancement';
  sortBy?: SortBy; // Sort order: 'createdAt' or 'updatedAt'
  cursor?: string; // Opaque pagination cursor
  limit?: number; // 1-100, default 10
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  cursor: string | null; // Opaque cursor for next page
  hasMore: boolean;
}

/**
 * Response from fetching issues
 */
export interface FetchIssuesResponse {
  issues: FeedlogIssue[];
  pagination: PaginationInfo;
}

/**
 * Response from upvoting an issue
 */
export interface UpvoteResponse {
  upvoted: boolean; // true if upvote was added, false if removed
  upvoteCount: number; // Updated total upvote count
  anonymousUserId: string; // Public ID of anonymous user
}

/**
 * SDK configuration
 */
export interface FeedlogSDKConfig {
  apiKey: string; // API key for authentication
  endpoint?: string; // API base URL, defaults to https://api.feedlog.app
  timeout?: number; // Request timeout in milliseconds, defaults to 30000
  credentials?: RequestCredentials; // Fetch credentials mode, defaults to 'include'
}

/**
 * Generic API response wrapper (for consistency)
 */
export interface FeedlogResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Event types for the toolkit
 */
export interface FeedlogEvent {
  id: string;
  timestamp: number;
  type: string;
  data?: Record<string, unknown>;
}
