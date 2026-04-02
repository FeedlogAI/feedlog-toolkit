# Build with the top-level client (`@feedlog-ai/react`)

Use **`FeedlogIssuesClient`** when you want props + events and the component performs fetching internally.

## When to use

- Standard client-rendered apps, or a client boundary in Next.js / RSC setups
- You do not need the initial HTML to already contain the issues array (for full SSR of issues data, see [BUILD_FEEDLOG_COMPOSABLE.md](./BUILD_FEEDLOG_COMPOSABLE.md))

## Install

```bash
npm install @feedlog-ai/react @feedlog-ai/core
```

(`@feedlog-ai/core` is often pulled in as a dependency; install explicitly if your tooling requires it.)

## Minimal example

```tsx
'use client';

import { FeedlogIssuesClient } from '@feedlog-ai/react';

export function Changelog() {
  return (
    <FeedlogIssuesClient
      apiKey="your-api-key"
      type="bug"
      limit={10}
      theme="light"
      maxWidth="42rem"
      onFeedlogUpvote={event => {
        console.log('Issue upvoted:', event.detail);
      }}
      onFeedlogError={event => {
        console.error('Error:', event.detail);
      }}
    />
  );
}
```

In the **Next.js App Router**, any file that imports `@feedlog-ai/react` for interactive components should be a **Client Component** (`'use client'`), as described in [README](./README.md#nextjs-app-router-or-pages-router).

## See also

- [README](./README.md) — SSR (`withFeedlogSSR`, `feedlogSSR`), TanStack Start, limitations
- [Build Feedlog](../../README.md#build-feedlog)
- [Customize Feedlog styling](../../docs/CUSTOMIZE_FEEDLOG_STYLING.md)
