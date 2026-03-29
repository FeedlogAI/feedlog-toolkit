---
name: build-your-own-feedlog
description: >-
  Guides building a Feedlog changelog at three levels: top-level client,
  composable components with custom data flow (SSR, loaders), or core-only
  custom UI. Use when choosing integration depth, full SSR, or AI-assisted codegen.
---

# Build Your Own Feedlog

Choose how much of the stack you control:

1. **Top-level client** — `FeedlogIssuesClient` / `<feedlog-issues-client>` fetches and renders; fastest path.
2. **Composable changelog** — You fetch with `FeedlogSDK` and pass `issues` into `FeedlogIssues` (or smaller pieces); best for SSR, loaders, and custom orchestration.
3. **Core-only** — Only `@feedlog-ai/core`: types, `fetchIssues`, `toggleUpvote`, optional `sanitizeHtml`; you build all UI.

Per-package walkthroughs:

| Tier          | Web components                                                                       | React                                                                        | Vue                                                                        | Core                                                                    |
| ------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1. Client     | [BUILD_FEEDLOG_CLIENT.md](../packages/webcomponents/BUILD_FEEDLOG_CLIENT.md)         | [BUILD_FEEDLOG_CLIENT.md](../packages/react/BUILD_FEEDLOG_CLIENT.md)         | [BUILD_FEEDLOG_CLIENT.md](../packages/vue/BUILD_FEEDLOG_CLIENT.md)         | —                                                                       |
| 2. Composable | [BUILD_FEEDLOG_COMPOSABLE.md](../packages/webcomponents/BUILD_FEEDLOG_COMPOSABLE.md) | [BUILD_FEEDLOG_COMPOSABLE.md](../packages/react/BUILD_FEEDLOG_COMPOSABLE.md) | [BUILD_FEEDLOG_COMPOSABLE.md](../packages/vue/BUILD_FEEDLOG_COMPOSABLE.md) | —                                                                       |
| 3. SDK-only   | —                                                                                    | —                                                                            | —                                                                          | [BUILD_FEEDLOG_SDK_ONLY.md](../packages/core/BUILD_FEEDLOG_SDK_ONLY.md) |

Styling with CSS variables (no custom data flow): [Customize Feedlog styling](CUSTOMIZE_FEEDLOG_STYLING.md). SDK API reference: [@feedlog-ai/core README](../packages/core/README.md).

---

## 1. Top-level client

**When to use:** You want one component with an API key; the widget handles fetching, errors, and upvotes.

**Summary:** Install `@feedlog-ai/webcomponents`, `@feedlog-ai/react`, or `@feedlog-ai/vue` and use `FeedlogIssuesClient` / `<feedlog-issues-client>`.

**Guides:** [Web components](../packages/webcomponents/BUILD_FEEDLOG_CLIENT.md) · [React](../packages/react/BUILD_FEEDLOG_CLIENT.md) · [Vue](../packages/vue/BUILD_FEEDLOG_CLIENT.md)

### Copy to Clipboard (tier 1)

```markdown
You are integrating Feedlog using the top-level client only.

**Approach:**

- Use FeedlogIssuesClient (React/Vue) or `<feedlog-issues-client>` (vanilla) from the matching @feedlog-ai package
- Pass apiKey and optional type, limit, theme, maxWidth
- Listen for upvote/error events as documented in the package README

**Do not** implement manual fetch unless the user asks for composable or core-only patterns.
```

---

## 2. Composable changelog

**When to use:** Full SSR without an empty flash, route loaders, dynamic props at request time, or custom loading/error UX while keeping Feedlog’s list and cards.

**Summary:** Use `FeedlogSDK` from `@feedlog-ai/core` to fetch (server or loader). Pass the `issues` array into `FeedlogIssues` / `<feedlog-issues>` (or `FeedlogIssuesList`, single-issue components). Handle `feedlogUpvote` with `sdk.toggleUpvote` and update state.

**Guides:** [Web components](../packages/webcomponents/BUILD_FEEDLOG_COMPOSABLE.md) · [React](../packages/react/BUILD_FEEDLOG_COMPOSABLE.md) · [Vue](../packages/vue/BUILD_FEEDLOG_COMPOSABLE.md)

**React note:** Import issues components from `@feedlog-ai/react`, not `@feedlog-ai/react/ssr-components` or `@feedlog-ai/react/next`.

### Copy to Clipboard (tier 2)

````markdown
You are building a composable Feedlog changelog: custom data flow + Feedlog UI components.

**Context:** FeedlogIssuesClient fetches internally; for SSR or request-time props, fetch with FeedlogSDK and pass data into FeedlogIssues (or feedlog-issues).

**Approach:**

- FeedlogSDK from @feedlog-ai/core for fetchIssues and toggleUpvote
- Presentation: FeedlogIssues / FeedlogIssuesList / FeedlogIssueComponent (React), or feedlog-issues (web components), or FeedlogIssues / FeedlogIssuesList / FeedlogIssue (Vue)
- Do NOT use FeedlogIssuesClient for this pattern

**Data flow:**

1. Fetch with FeedlogSDK.fetchIssues({ type?, limit?, cursor?, ... }) where your framework resolves the API key (server, loader, etc.)
2. Pass issues into the presentation component as a property/array prop
3. On feedlogUpvote: sdk.toggleUpvote(issueId), then optimistically update issues or re-fetch

**Framework patterns:**

- Next.js App Router: async Server Component calls fetchIssues, renders FeedlogIssues with issues; wrap upvote handling in a client component if needed
- Next.js Pages: getServerSideProps / getStaticProps → pass issues to FeedlogIssues
- Vite / Remix: loader fetch → page renders FeedlogIssues with data
- Vanilla: dynamic import SDK + components; set element.issues after fetch

**React imports:** @feedlog-ai/react for FeedlogIssues (not ssr-components/next for the issues list).

**Example (Next.js App Router):**

```tsx
import { FeedlogIssues } from '@feedlog-ai/react';
import { FeedlogSDK } from '@feedlog-ai/core';

export default async function IssuesPage() {
  const sdk = new FeedlogSDK({ apiKey: process.env.FEEDLOG_API_KEY! });
  const { issues } = await sdk.fetchIssues({ limit: 10 });
  return <FeedlogIssues issues={issues} theme="light" />;
}
```

For upvotes, use a client component that listens for feedlogUpvote, calls sdk.toggleUpvote(issueId), and updates local state.
````

---

## 3. Core-only custom UI

**When to use:** You want full control over HTML/CSS/framework components and only need the Feedlog API and types.

**Summary:** Install `@feedlog-ai/core` only. You do **not** need `@feedlog-ai/react`, `@feedlog-ai/vue`, or `@feedlog-ai/webcomponents` for rendering. Use `FeedlogSDK`, `FeedlogIssue` types, and optionally `sanitizeHtml` for issue bodies.

**Guide:** [BUILD_FEEDLOG_SDK_ONLY.md](../packages/core/BUILD_FEEDLOG_SDK_ONLY.md)

### Copy to Clipboard (tier 3)

```markdown
You are building a Feedlog-powered changelog with a fully custom UI (no Feedlog web components or React/Vue bindings).

**Approach:**

- Only @feedlog-ai/core: FeedlogSDK, types (FeedlogIssue), sanitizeHtml for HTML bodies
- fetchIssues for the list; toggleUpvote(issueId) when the user votes
- Render your own markup; handle loading, errors, and pagination in your app

**Do not** import @feedlog-ai/react, @feedlog-ai/vue, or @feedlog-ai/webcomponents unless the user explicitly wants those layers.
```
