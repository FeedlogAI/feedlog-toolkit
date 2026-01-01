# Migration Guide: API Changes (2025-12-31)

## Overview

This is a **BREAKING RELEASE** with NO backward compatibility. All consumers must update their code to use the new API. This guide helps you migrate from the old mock API to the new real API with upvoting support.

---

## Key Changes

### 1. SDK Constructor
The SDK now requires a configuration object instead of accepting a string API key.

**Before:**
```typescript
const sdk = new FeedlogSDK('my-api-key');
```

**After:**
```typescript
const sdk = new FeedlogSDK({ apiKey: 'my-api-key' });
```

### 2. Issue Type Changes
The `GitHubIssue` type is completely removed. Use the new `FeedlogIssue` type instead.

**Type Changes:**
```typescript
// Before
interface GitHubIssue {
  id: number;              // Now: string
  title: string;
  body: string;
  type: 'bug' | 'enhancement';
  upvotes?: number;        // Removed: use upvoteCount
  postedAt?: string;       // Removed
}

// After
interface FeedlogIssue {
  id: string;                    // Changed from number
  githubIssueNumber: number;     // NEW
  type: 'bug' | 'enhancement';
  status: 'open' | 'closed';     // NEW
  pinnedAt: string | null;       // NEW
  title: string;
  body: string;
  revision: number;              // NEW
  repository: {                  // NEW nested object
    id: string;
    name: string;
    owner: string;
  };
  updatedAt: string;             // NEW
  createdAt: string;             // NEW
  upvoteCount: number;           // NEW (was upvotes)
  hasUpvoted: boolean;           // NEW
}
```

### 3. API Method Changes
The `fetchIssues` method now takes a parameters object and returns pagination information.

**Before:**
```typescript
const issues: GitHubIssue[] = await sdk.fetchIssues(['owner/repo']);
```

**After:**
```typescript
const response = await sdk.fetchIssues({
  repositoryIds: ['repo-public-id'],  // Array of repository public IDs
  type: 'bug',                        // Optional: filter by type
  limit: 10,                          // Optional: items per page (1-100)
  cursor: undefined,                  // Optional: for pagination
});

const issues: FeedlogIssue[] = response.issues;
const hasMore: boolean = response.pagination.hasMore;
const nextCursor: string | null = response.pagination.cursor;
```

### 4. Repository Handling
Repository information is now embedded in each issue. The separate repository endpoints are removed.

**Before:**
```typescript
// Fetch repository details separately
const repoDetails = await fetch('/api/repositories/repo-id').then(r => r.json());
const repoName = repoDetails.name;
```

**After:**
```typescript
// Repository info is in each issue
const repoName = issue.repository.name;
const repoOwner = issue.repository.owner;
const repoId = issue.repository.id;
```

### 5. New Upvoting Functionality
A new method to toggle upvotes on issues.

```typescript
const result = await sdk.toggleUpvote('issue-public-id');

console.log(result.upvoted);        // true if upvote was added
console.log(result.upvoteCount);    // Updated count
console.log(result.anonymousUserId); // User ID (for reference)
```

---

## Migration Steps

### Step 1: Update Package Imports

**Before:**
```typescript
import { FeedlogSDK, GitHubIssue } from '@feedlog-toolkit/core';
```

**After:**
```typescript
import { FeedlogSDK, FeedlogIssue, FetchIssuesResponse } from '@feedlog-toolkit/core';
```

### Step 2: Update SDK Initialization

**Before:**
```typescript
const sdk = new FeedlogSDK(apiKey);
```

**After:**
```typescript
const sdk = new FeedlogSDK({
  apiKey: 'pk_live_...',  // Public API key only
  endpoint: 'https://api.feedlog.app',  // Optional
  timeout: 30000,          // Optional
});
```

### Step 3: Update Issue Fetching

**Before:**
```typescript
async function loadIssues(repos: string[]): Promise<void> {
  try {
    const issues = await sdk.fetchIssues(repos);
    this.issues = issues;
  } catch (error) {
    console.error('Failed to load issues', error);
  }
}
```

**After:**
```typescript
async function loadIssues(repos: string[], type?: 'bug' | 'enhancement'): Promise<void> {
  try {
    const response = await sdk.fetchIssues({
      repositoryIds: repos,
      type: type,
      limit: 10,
    });
    
    this.issues = response.issues;
    this.hasMore = response.pagination.hasMore;
    this.cursor = response.pagination.cursor;
  } catch (error) {
    console.error('Failed to load issues', error);
  }
}
```

### Step 4: Add Pagination Support

**Before:**
```typescript
// No pagination - loaded all at once
const issues = await sdk.fetchIssues(repos);
```

**After:**
```typescript
// With pagination
let allIssues: FeedlogIssue[] = [];
let cursor: string | null = null;
let hasMore = true;

while (hasMore) {
  const response = await sdk.fetchIssues({
    repositoryIds: repos,
    cursor: cursor,
    limit: 10,
  });
  
  allIssues = [...allIssues, ...response.issues];
  cursor = response.pagination.cursor;
  hasMore = response.pagination.hasMore;
}
```

### Step 5: Implement Upvoting

**Before:**
```typescript
// Upvoting was not supported
<button onClick={() => console.log('Not implemented')}>Upvote</button>
```

**After:**
```typescript
// Implement upvote with optimistic updates
async function handleUpvote(issue: FeedlogIssue): Promise<void> {
  // Optimistic update
  const updatedIssues = this.issues.map(i =>
    i.id === issue.id
      ? {
          ...i,
          hasUpvoted: !i.hasUpvoted,
          upvoteCount: i.hasUpvoted ? i.upvoteCount - 1 : i.upvoteCount + 1,
        }
      : i
  );
  this.issues = updatedIssues;

  try {
    // Make API call
    const result = await sdk.toggleUpvote(issue.id);
    
    // Update with server response
    this.issues = this.issues.map(i =>
      i.id === issue.id
        ? {
            ...i,
            hasUpvoted: result.upvoted,
            upvoteCount: result.upvoteCount,
          }
        : i
    );
  } catch (error) {
    // Revert optimistic update
    this.issues = updatedIssues.map(i =>
      i.id === issue.id ? issue : i
    );
    console.error('Failed to toggle upvote', error);
  }
}

// In template
<button onClick={() => handleUpvote(issue)} disabled={isLoading}>
  {issue.hasUpvoted ? '❤️' : '🤍'} {issue.upvoteCount}
</button>
```

### Step 6: Update Web Component Usage

**Before:**
```html
<feedlog-github-issues-client
  pk="my-api-key"
  repos="owner/repo"
  maxWidth="42rem"
  theme="light"
></feedlog-github-issues-client>
```

**After:**
```html
<!-- Single repository -->
<feedlog-github-issues-client
  pk="pk_live_..."
  repos="repo-public-id"
  maxWidth="42rem"
  theme="light"
></feedlog-github-issues-client>

<!-- Multiple repositories -->
<feedlog-github-issues-client
  pk="pk_live_..."
  repos='["repo-id-1", "repo-id-2"]'
  type="bug"
  limit="20"
  maxWidth="42rem"
  theme="light"
></feedlog-github-issues-client>
```

### Step 7: Handle Cookies and Credentials

The SDK now automatically handles cookies for anonymous user tracking. Ensure your API configuration allows cross-origin cookies:

```typescript
// SDK automatically includes credentials
// No additional configuration needed on client side

// But verify on server side:
// - CORS headers include: Access-Control-Allow-Credentials: true
// - Set-Cookie includes: SameSite=None; Secure
```

---

## Common Migration Patterns

### Pattern 1: Displaying Issues with Repository Info

**Before:**
```typescript
// Had to fetch repo separately
issues.forEach(issue => {
  console.log(`${repoName}/#${issue.id}: ${issue.title}`);
});
```

**After:**
```typescript
// Repository info included
issues.forEach(issue => {
  console.log(`${issue.repository.owner}/${issue.repository.name}#${issue.githubIssueNumber}: ${issue.title}`);
});
```

### Pattern 2: Filtering by Type

**Before:**
```typescript
// Had to filter client-side
const bugIssues = issues.filter(i => i.type === 'bug');
```

**After:**
```typescript
// Filter server-side
const response = await sdk.fetchIssues({
  repositoryIds: repos,
  type: 'bug',  // Server-side filtering
});
```

### Pattern 3: Load More Functionality

**Before:**
```typescript
// Couldn't implement pagination
// Had to load all issues at once
const issues = await sdk.fetchIssues(repos);
```

**After:**
```typescript
// Proper pagination support
async function loadMore(): Promise<void> {
  if (!this.hasMore) return;
  
  const response = await sdk.fetchIssues({
    repositoryIds: this.repos,
    cursor: this.cursor,  // Continue from last cursor
    limit: 10,
  });
  
  this.issues.push(...response.issues);
  this.cursor = response.pagination.cursor;
  this.hasMore = response.pagination.hasMore;
}
```

---

## Error Handling

The SDK now provides typed errors. Update your error handling:

```typescript
import {
  FeedlogSDK,
  FeedlogError,
  FeedlogNetworkError,
  FeedlogValidationError,
  FeedlogTimeoutError,
} from '@feedlog-toolkit/core';

try {
  const response = await sdk.fetchIssues({ repositoryIds: repos });
} catch (error) {
  if (error instanceof FeedlogNetworkError) {
    console.error(`Network error (${error.statusCode}):`, error.message);
  } else if (error instanceof FeedlogValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof FeedlogTimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof FeedlogError) {
    console.error('API error:', error.message);
  }
}
```

---

## Breaking Changes Summary

| Feature | Before | After | Action Required |
|---------|--------|-------|-----------------|
| Constructor | `new FeedlogSDK(key)` | `new FeedlogSDK({apiKey})` | Update all instantiations |
| Issue Type | `GitHubIssue` | `FeedlogIssue` | Update all type imports |
| Issue ID | `number` | `string` | Update comparisons |
| Upvotes | `upvotes?: number` | `upvoteCount: number` | Rename field |
| Repository Endpoints | `/api/repositories/*` | Removed | Use issue.repository |
| Fetch Response | Array | Object with pagination | Update response handling |
| Repo Format | `owner/repo` | Repository public ID | Update prop values |

---

## Testing Checklist

- [ ] Update all type imports
- [ ] Update SDK initialization
- [ ] Update issue fetching logic
- [ ] Add pagination support
- [ ] Implement upvoting UI
- [ ] Update error handling
- [ ] Test on target domain(s)
- [ ] Verify CORS configuration
- [ ] Test with cookies enabled/disabled
- [ ] Test on mobile browsers
- [ ] Test with strict CSP policy
- [ ] Update component props in HTML
- [ ] Test all issue types rendering
- [ ] Test repository information display
- [ ] Test theme switching

---

## Getting Help

If you encounter issues during migration:

1. **Check the SECURITY.md** for security-related questions
2. **Review code examples** in this guide
3. **Check your API key** is a public key (starts with `pk_`)
4. **Verify CORS settings** for your domain in Feedlog dashboard
5. **Check browser console** for detailed error messages
6. **Test with network tab** in DevTools to see API responses

---

## Version Information

- **Release Date:** December 31, 2025
- **Next Breaking Change:** TBD
- **Support Period:** Until next major version

For questions or issues, contact: support@feedlog.app

