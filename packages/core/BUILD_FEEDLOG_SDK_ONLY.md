# Core-only changelog (`@feedlog-ai/core`)

Build **your own HTML/CSS/components** and use the Feedlog API through **`FeedlogSDK`** only. You do **not** need `@feedlog-ai/react`, `@feedlog-ai/vue`, or `@feedlog-ai/webcomponents` for the UI layer.

## When to use

- Full design control in your design system
- Non-React/Vue stacks, email templates (with appropriate constraints), or native apps calling the same API patterns from your backend

## Install

```bash
npm install @feedlog-ai/core
```

## Fetch and render (conceptual)

```typescript
import { FeedlogSDK, sanitizeHtml, type FeedlogIssue } from '@feedlog-ai/core';

const sdk = new FeedlogSDK({ apiKey: process.env.FEEDLOG_API_KEY! });

const { issues, pagination } = await sdk.fetchIssues({ limit: 20, type: 'enhancement' });

function renderIssue(issue: FeedlogIssue): string {
  const title = escapeHtml(issue.title ?? 'Untitled');
  // `body` is Markdown from the API; convert in your stack, or show as plain text.
  const bodyText = escapeHtml(issue.body ?? '');
  return `
    <article data-issue-id="${issue.id}">
      <h2>${title}</h2>
      <pre>${bodyText}</pre>
      <button type="button" data-upvote>Upvote (${issue.upvoteCount})</button>
    </article>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Wire buttons: read issue id, call sdk.toggleUpvote(issueId), update counts in your state/DOM
```

Use your framework’s state and event model instead of raw `innerHTML` where possible. If you insert HTML strings from elsewhere, use **`sanitizeHtml`** from `@feedlog-ai/core` before assigning to the DOM.

## Upvoting

```typescript
const { upvoted, upvoteCount } = await sdk.toggleUpvote(issueId);
```

## Types

Import **`FeedlogIssue`**, **`FetchIssuesResponse`**, **`FetchIssuesParams`**, and errors from `@feedlog-ai/core` for typed UI code.

## Pagination

Use **`pagination.cursor`** and **`pagination.hasMore`** from `fetchIssues` and pass **`cursor`** on the next request.

## See also

- [README](./README.md) — full SDK reference, error types, configuration
- [Build Your Own Feedlog hub](../../docs/BUILD_YOUR_OWN_FEEDLOG.md)
