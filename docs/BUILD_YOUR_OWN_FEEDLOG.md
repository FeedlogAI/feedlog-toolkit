---
name: build-your-own-feedlog
description: >-
  Builds a custom feedlog implementation without FeedlogIssuesClient for full SSR,
  custom data flow, or framework-specific patterns. Use when the user needs
  server-rendered issues, cannot use FeedlogIssuesClient due to dynamic props,
  or wants to implement their own data fetching.
---

# Build Your Own Feedlog

When you need full SSR (no flash of empty content), custom data flow, or framework-specific patterns, you can build your own feedlog without using `FeedlogIssuesClient`. Use `FeedlogSDK` from `@feedlog-ai/core` for fetching and upvoting, and `FeedlogIssues` from `@feedlog-ai/react` for display.

## Instructions

1. **Fetch on the server** (or in a route loader): Use `FeedlogSDK.fetchIssues()` with your API key.
2. **Pass data to `FeedlogIssues`**: Render `<FeedlogIssues issues={issues} theme="light" ... />` with the fetched array.
3. **Handle upvotes client-side**: Listen for `feedlogUpvote` events, call `sdk.toggleUpvote(issueId)`, and update local state (or re-fetch).
4. **Import from `@feedlog-ai/react`**: Do not use `@feedlog-ai/react/ssr-components` or `@feedlog-ai/react/next` for the issues components.

See [@feedlog-ai/core](../packages/core/README.md) for SDK API details.

## Copy to Clipboard

Copy the block below and paste it into your AI assistant or code generator (e.g. Claude Code, Cursor, GitHub Copilot) to generate a custom implementation:

````markdown
You are helping build a custom feedlog implementation without using FeedlogIssuesClient.

**Context:** FeedlogIssuesClient fetches internally and cannot resolve dynamic props at build time for SSR. For full server-rendered issues (no flash of empty content), build a custom wrapper that fetches on the server and passes data to FeedlogIssues.

**Approach:**
- Use FeedlogSDK from @feedlog-ai/core for fetching and upvoting
- Use FeedlogIssues (or FeedlogIssuesList, FeedlogIssueComponent) from @feedlog-ai/react for display
- Do NOT use FeedlogIssuesClient

**Data flow:**
1. Fetch issues on the server (or in route loader) with FeedlogSDK.fetchIssues({ type?, limit?, sortBy?, cursor? })
2. Pass the issues array to FeedlogIssues: <FeedlogIssues issues={issues} theme="light" maxWidth="42rem" ... />
3. Handle feedlogUpvote events client-side: call sdk.toggleUpvote(issueId), then optimistically update the issues array or re-fetch

**Framework patterns:**
- Next.js App Router: Create an async Server Component that calls new FeedlogSDK({ apiKey }).fetchIssues(), then renders FeedlogIssues with the result
- Next.js Pages Router: Use getServerSideProps or getStaticProps to fetch issues, pass to page, render FeedlogIssues
- Vite / Remix: Fetch in the route loader, pass data to the page component, render FeedlogIssues with the fetched issues array

**Important:** The wrapper must run on the server so props are resolved at request time. Import FeedlogIssues from @feedlog-ai/react (not @feedlog-ai/react/ssr-components or @feedlog-ai/react/next).

**Example (Next.js App Router):**

```tsx
// app/issues/page.tsx
import { FeedlogIssues } from '@feedlog-ai/react';
import { FeedlogSDK } from '@feedlog-ai/core';

export default async function IssuesPage() {
  const sdk = new FeedlogSDK({ apiKey: process.env.FEEDLOG_API_KEY! });
  const { issues } = await sdk.fetchIssues({ limit: 10 });
  return <FeedlogIssues issues={issues} theme="light" />;
}
```

For upvote handling, create a client component that wraps FeedlogIssues, listens for feedlogUpvote, calls sdk.toggleUpvote(issueId), and updates local state.
````
