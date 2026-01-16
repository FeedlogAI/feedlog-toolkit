# @feedlog-ai/core

Core SDK package providing shared utilities, types, and functionality used across all Feedlog Toolkit packages.

## Features

- **TypeScript-based SDK**: Fully typed for better developer experience
- **Shared types and interfaces**: Consistent type definitions across packages
- **Utility functions**: HTML sanitization and other utilities
- **Core Feedlog SDK class**: Main API client for interacting with Feedlog services
- **Error handling**: Comprehensive error types and handling
- **Pagination support**: Built-in support for paginated API responses

## Installation

```bash
npm install @feedlog-ai/core
```

## Usage

### Initializing the SDK

```typescript
import { FeedlogSDK } from '@feedlog-ai/core';

// Initialize with required configuration
const sdk = new FeedlogSDK({
  apiKey: 'your-api-key', // Required: API key for authentication
});

// Or initialize with custom configuration
const customSdk = new FeedlogSDK({
  apiKey: 'your-api-key', // Required: API key for authentication
  endpoint: 'https://api.feedlog.app', // Custom API endpoint (optional)
  timeout: 30000, // Request timeout in milliseconds (optional)
  credentials: 'include', // Fetch credentials mode (optional)
});
```

### Fetching Issues

```typescript
// Fetch issues with default parameters
const response = await sdk.fetchIssues();

// Fetch issues with filters
const filteredResponse = await sdk.fetchIssues({
  type: 'bug', // 'bug' or 'enhancement'
  limit: 20, // Maximum number of issues (1-100)
  cursor: 'next-page-cursor', // For pagination
});

// Fetch issues from specific repositories
const repoResponse = await sdk.fetchIssues({
  repositoryIds: ['repo-id-1', 'repo-id-2'], // Array of repository IDs
  type: 'enhancement',
  limit: 10,
});
```

### Upvoting Issues

```typescript
// Toggle upvote on an issue
const upvoteResult = await sdk.toggleUpvote('issue-id');

console.log(upvoteResult.upvoted); // true if upvoted, false if unvoted
console.log(upvoteResult.upvoteCount); // Updated upvote count
console.log(upvoteResult.anonymousUserId); // User's anonymous ID
```

## API Reference

### FeedlogSDK

The main SDK class for interacting with the Feedlog API.

#### Constructor

```typescript
new FeedlogSDK(config: FeedlogSDKConfig)
```

#### Methods

- `fetchIssues(params?: FetchIssuesParams): Promise<FetchIssuesResponse>`
- `toggleUpvote(issueId: string): Promise<UpvoteResponse>`
- `getEndpoint(): string` - Get current API endpoint
- `getTimeout(): number` - Get current timeout setting

### Types

#### Core Types

- `FeedlogIssue` - GitHub issue data structure
- `Repository` - Repository information
- `FetchIssuesParams` - Parameters for fetching issues
- `FetchIssuesResponse` - Response from fetching issues
- `UpvoteResponse` - Response from upvoting an issue
- `FeedlogSDKConfig` - SDK configuration options

#### Error Types

- `FeedlogError` - Base error class
- `FeedlogNetworkError` - Network-related errors
- `FeedlogTimeoutError` - Timeout errors
- `FeedlogValidationError` - Validation errors

### Utilities

- `sanitizeHtml(html: string): string` - Sanitize HTML content to prevent XSS

## Error Handling

The SDK provides specific error types for different failure scenarios:

```typescript
import {
  FeedlogError,
  FeedlogNetworkError,
  FeedlogTimeoutError,
  FeedlogValidationError,
} from '@feedlog-ai/core';

try {
  const issues = await sdk.fetchIssues();
} catch (error) {
  if (error instanceof FeedlogNetworkError) {
    console.error('Network error:', error.statusCode);
  } else if (error instanceof FeedlogTimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof FeedlogValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof FeedlogError) {
    console.error('Feedlog error:', error.message);
  }
}
```

## Requirements

- Node.js >= 22.0.0
- TypeScript >= 5.3.3 (for type definitions)

## License

MIT
