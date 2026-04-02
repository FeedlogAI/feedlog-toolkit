# Composable changelog (`@feedlog-ai/react` + `@feedlog-ai/core`)

Use **`FeedlogSDK.fetchIssues`** where your app resolves the API key (server, loader, or client), then render **`FeedlogIssues`** with an **`issues`** prop. You handle **`onFeedlogUpvote`** with **`sdk.toggleUpvote`**.

## When to use

- **Full SSR** of the issues list (props resolved at request time, no empty flash from client-only fetch inside the widget)
- **Dynamic props** that Stencil’s static SSR analysis cannot serialize (see [README](./README.md#ssr-limitations))

## When not to use imports

Do **not** import `FeedlogIssues` from `@feedlog-ai/react/ssr-components` or `@feedlog-ai/react/next` for the issues list. Use the main package: `@feedlog-ai/react`.

## Install

```bash
npm install @feedlog-ai/react @feedlog-ai/core
```

## Server-rendered page (Next.js App Router)

```tsx
// app/changelog/page.tsx
import { FeedlogIssues } from '@feedlog-ai/react';
import { FeedlogSDK } from '@feedlog-ai/core';

export default async function ChangelogPage() {
  const sdk = new FeedlogSDK({ apiKey: process.env.FEEDLOG_API_KEY! });
  const { issues } = await sdk.fetchIssues({ limit: 10 });
  return <FeedlogIssues issues={issues} theme="light" maxWidth="42rem" />;
}
```

## Client upvote handling

Upvotes need a browser and your SDK instance (or an API route). Typical pattern: a **client component** wraps `FeedlogIssues`, keeps `issues` in state initialized from server props, and on `onFeedlogUpvote` calls `toggleUpvote` then updates state or re-fetches.

```tsx
'use client';

import { useState, useMemo } from 'react';
import { FeedlogIssues } from '@feedlog-ai/react';
import { FeedlogSDK, type FeedlogIssue } from '@feedlog-ai/core';

export function ChangelogInteractive({ initialIssues }: { initialIssues: FeedlogIssue[] }) {
  const [issues, setIssues] = useState(initialIssues);
  const sdk = useMemo(
    () => new FeedlogSDK({ apiKey: process.env.NEXT_PUBLIC_FEEDLOG_API_KEY! }),
    []
  );

  return (
    <FeedlogIssues
      issues={issues}
      theme="light"
      onFeedlogUpvote={async event => {
        const { issueId } = event.detail;
        await sdk.toggleUpvote(issueId);
        const { issues: next } = await sdk.fetchIssues({ limit: 10 });
        setIssues(next);
      }}
    />
  );
}
```

Adjust API key handling for your framework (env, server actions, etc.).

## Finer composition

You can also use:

- **`FeedlogIssuesList`** — list without outer chrome (see package exports)
- **`FeedlogIssueComponent`** — single card; pass `issue={...}`

## Other frameworks

- **Pages Router / `getServerSideProps`:** Fetch in the data hook, pass `issues` into `FeedlogIssues` on the page.
- **Remix / Vite loaders:** Fetch in the loader, pass `issues` as props.

## See also

- [@feedlog-ai/core README](../core/README.md)
- [README](./README.md) — SSR plugins and troubleshooting
- [Build Feedlog](../../README.md#build-feedlog)
