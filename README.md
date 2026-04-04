# Feedlog Toolkit

A monorepo containing the Feedlog Toolkit - a comprehensive set of packages for building GitHub issue management components and SDKs.

> **From issue chaos to changelogs users love.** FeedLog turns rough GitHub issues into clear, publish-ready changelog updates, without leaving your repo. [Get started at feedlog.dev](https://feedlog.dev/)

## 📦 Packages

This monorepo contains the following packages:

### `@feedlog-ai/core`

```bash
npm install @feedlog-ai/core
```

[npm](https://www.npmjs.com/package/@feedlog-ai/core) · [packages/core](packages/core)

Core SDK package providing shared utilities, types, and functionality used across all Feedlog Toolkit packages.

**Features:**

- TypeScript-based SDK
- Shared types and interfaces
- Utility functions
- Core Feedlog SDK class

### `@feedlog-ai/webcomponents`

```bash
npm install @feedlog-ai/webcomponents
```

[npm](https://www.npmjs.com/package/@feedlog-ai/webcomponents) · [packages/webcomponents](packages/webcomponents)

Stencil-based web components for GitHub issue management. These are framework-agnostic web components that can be used in any JavaScript framework or vanilla HTML.

**Features:**

- Built with [Stencil](https://stenciljs.com/)
- Web Components standard (Custom Elements, Shadow DOM)
- GitHub issue display and management components
- Tree-shakeable builds
- Auto-generated React and Vue wrappers

### `@feedlog-ai/react`

```bash
npm install @feedlog-ai/react
```

[npm](https://www.npmjs.com/package/@feedlog-ai/react) · [packages/react](packages/react)

React bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- React components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on React >=17.0.0

### `@feedlog-ai/vue`

```bash
npm install @feedlog-ai/vue
```

[npm](https://www.npmjs.com/package/@feedlog-ai/vue) · [packages/vue](packages/vue)

Vue bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- Vue 3 components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on Vue >=3.0.0 or >=2.6.0

## 📚 Usage Examples

### Using Web Components (Vanilla HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="/node_modules/@feedlog-ai/webcomponents/dist/feedlog-toolkit/feedlog-toolkit.esm.js"
    ></script>
  </head>
  <body>
    <feedlog-issues-client
      api-key="your-api-key"
      type="bug"
      limit="10"
      theme="light"
      max-width="42rem"
    >
    </feedlog-issues-client>
  </body>
</html>
```

### Using React Components

```tsx
import React from 'react';
import { FeedlogIssuesClient } from '@feedlog-ai/react';

function App() {
  return (
    <div>
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
    </div>
  );
}
```

### Using Vue Components

```vue
<template>
  <feedlog-issues-client
    api-key="your-api-key"
    type="bug"
    :limit="10"
    theme="light"
    max-width="42rem"
    @feedlog-upvote="handleUpvote"
    @feedlog-error="handleError"
  >
  </feedlog-issues-client>
</template>

<script setup lang="ts">
import { FeedlogIssuesClient } from '@feedlog-ai/vue';

const handleUpvote = (event: CustomEvent) => {
  console.log('Issue upvoted:', event.detail);
};

const handleError = (event: CustomEvent) => {
  console.error('Error:', event.detail);
};
</script>
```

## Build Feedlog

Use Feedlog **as shipped** with the top-level client, or choose how much you own: **all-in-one client** (built-in fetch), **composable UI** (you fetch with `FeedlogSDK`, Feedlog renders the list), or **core-only** (your markup, SDK for data and upvotes).

1. **Top-level client** — `FeedlogIssuesClient` / `<feedlog-issues-client>` fetches and renders; fastest path.
2. **Composable changelog** — You fetch with `FeedlogSDK` and pass `issues` into `FeedlogIssues` (or smaller pieces); best for SSR, loaders, and custom orchestration.
3. **Core-only** — Only `@feedlog-ai/core`: types, `fetchIssues`, `toggleUpvote`, optional `sanitizeHtml`; you build all UI.

Per-package walkthroughs:

| Tier       | Web components                                                                    | React                                                                     | Vue                                                                     | Core                                                                 |
| ---------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Client     | [BUILD_FEEDLOG_CLIENT.md](packages/webcomponents/BUILD_FEEDLOG_CLIENT.md)         | [BUILD_FEEDLOG_CLIENT.md](packages/react/BUILD_FEEDLOG_CLIENT.md)         | [BUILD_FEEDLOG_CLIENT.md](packages/vue/BUILD_FEEDLOG_CLIENT.md)         | —                                                                    |
| Composable | [BUILD_FEEDLOG_COMPOSABLE.md](packages/webcomponents/BUILD_FEEDLOG_COMPOSABLE.md) | [BUILD_FEEDLOG_COMPOSABLE.md](packages/react/BUILD_FEEDLOG_COMPOSABLE.md) | [BUILD_FEEDLOG_COMPOSABLE.md](packages/vue/BUILD_FEEDLOG_COMPOSABLE.md) | —                                                                    |
| SDK-only   | —                                                                                 | —                                                                         | —                                                                       | [BUILD_FEEDLOG_SDK_ONLY.md](packages/core/BUILD_FEEDLOG_SDK_ONLY.md) |

SDK API reference: [packages/core README](packages/core/README.md). For **CSS-only** theming (no custom data flow), see [Customize Feedlog styling](docs/CUSTOMIZE_FEEDLOG_STYLING.md) below.

### 1. Top-level client

**When to use:** You want one component with an API key; the widget handles fetching, errors, and upvotes.

**Summary:** Install `@feedlog-ai/webcomponents`, `@feedlog-ai/react`, or `@feedlog-ai/vue` and use `FeedlogIssuesClient` / `<feedlog-issues-client>`.

**Guides:** [Web components](packages/webcomponents/BUILD_FEEDLOG_CLIENT.md) · [React](packages/react/BUILD_FEEDLOG_CLIENT.md) · [Vue](packages/vue/BUILD_FEEDLOG_CLIENT.md)

#### Copy to clipboard (tier 1)

```markdown
You are integrating Feedlog using the top-level client only.

**Approach:**

- Use FeedlogIssuesClient (React/Vue) or `<feedlog-issues-client>` (vanilla) from the matching @feedlog-ai package
- Pass `apiKey` and optional filters (`type`, `limit`, `sortBy`), layout (`theme`, `maxWidth`, `heading`, `subtitle`), pagination (`paginationType`, `loadMoreLabel`), and empty-state copy — see the package README for the full list
- Listen for upvote/error events as documented in the package README

**Do not** implement manual fetch unless the user asks for composable or core-only patterns.
```

### 2. Composable changelog

**When to use:** Full SSR without an empty flash, route loaders, dynamic props at request time, or custom loading/error UX while keeping Feedlog’s list and cards.

**Summary:** Use `FeedlogSDK` from `@feedlog-ai/core` to fetch (server or loader). Pass the `issues` array into `FeedlogIssues` / `<feedlog-issues>` (or `FeedlogIssuesList`, single-issue components). Handle `feedlogUpvote` with `sdk.toggleUpvote` and update state.

**Guides:** [Web components](packages/webcomponents/BUILD_FEEDLOG_COMPOSABLE.md) · [React](packages/react/BUILD_FEEDLOG_COMPOSABLE.md) · [Vue](packages/vue/BUILD_FEEDLOG_COMPOSABLE.md)

**React note:** Import issues components from `@feedlog-ai/react`, not `@feedlog-ai/react/ssr-components` or `@feedlog-ai/react/next`.

#### Copy to clipboard (tier 2)

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

### 3. Core-only custom UI

**When to use:** You want full control over HTML/CSS/framework components and only need the Feedlog API and types.

**Summary:** Install `@feedlog-ai/core` only. You do **not** need `@feedlog-ai/react`, `@feedlog-ai/vue`, or `@feedlog-ai/webcomponents` for rendering. Use `FeedlogSDK`, `FeedlogIssue` types, and optionally `sanitizeHtml` for issue bodies.

**Guide:** [BUILD_FEEDLOG_SDK_ONLY.md](packages/core/BUILD_FEEDLOG_SDK_ONLY.md)

#### Copy to clipboard (tier 3)

```markdown
You are building a Feedlog-powered changelog with a fully custom UI (no Feedlog web components or React/Vue bindings).

**Approach:**

- Only @feedlog-ai/core: FeedlogSDK, types (FeedlogIssue), sanitizeHtml for HTML bodies
- fetchIssues for the list; toggleUpvote(issueId) when the user votes
- Render your own markup; handle loading, errors, and pagination in your app

**Do not** import @feedlog-ai/react, @feedlog-ai/vue, or @feedlog-ai/webcomponents unless the user explicitly wants those layers.
```

## 🎨 Style Customization

Customize the changelog widget to match your product. Set CSS custom properties on the component—works with vanilla HTML, React, Vue, or any framework. For the **full `--feedlog-*` reference** (grouped by component and source file), see [Customize Feedlog styling](docs/CUSTOMIZE_FEEDLOG_STYLING.md).

### Quick copy-paste examples

**1. Emerald theme** (serif typography, green accent):

```css
feedlog-issues-client,
feedlog-issues {
  font-family: 'Georgia', 'Times New Roman', serif;
  /* Card */
  --feedlog-card-padding: 1.5rem;
  --feedlog-card-radius: 0.875rem;
  --feedlog-radius: 0.875rem;
  --feedlog-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12), 0 1px 3px -1px rgba(0, 0, 0, 0.1);
  --feedlog-shadow-hover-enhancement:
    0 8px 24px -4px rgba(5, 150, 105, 0.15), 0 4px 8px -2px rgba(5, 150, 105, 0.1);
  --feedlog-shadow-hover-bug:
    0 8px 24px -4px rgba(220, 38, 38, 0.15), 0 4px 8px -2px rgba(220, 38, 38, 0.1);
  /* Typography */
  --feedlog-title-font-size: 1.0625rem;
  --feedlog-title-font-weight: 700;
  --feedlog-body-font-size: 0.875rem;
  --feedlog-body-line-height: 1.6;
  --feedlog-timestamp-font-size: 0.75rem;
  /* Colors */
  --feedlog-accent-color: #059669;
  --feedlog-muted: #ecfdf5;
  --feedlog-muted-foreground: #047857;
  --feedlog-border: rgba(5, 150, 105, 0.2);
}
```

**2. Minimal (compact, subtle shadows):**

```css
feedlog-issues-client,
feedlog-issues {
  --feedlog-card-padding: 1rem;
  --feedlog-card-radius: 0.5rem;
  --feedlog-radius: 0.5rem;
  --feedlog-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  --feedlog-shadow-hover-enhancement: 0 2px 8px rgba(0, 0, 0, 0.08);
  --feedlog-shadow-hover-bug: 0 2px 8px rgba(0, 0, 0, 0.08);
  --feedlog-title-font-size: 0.9375rem;
  --feedlog-body-font-size: 0.8125rem;
}
```

**3. Brand accent (swap accent color only):**

```css
feedlog-issues-client,
feedlog-issues {
  --feedlog-accent-color: #7c3aed; /* purple */
  /* Or: #dc2626 (red), #0891b2 (cyan), #ea580c (orange) */
}
```

### Full variable reference

- **[Customize Feedlog styling](docs/CUSTOMIZE_FEEDLOG_STYLING.md)** — complete `--feedlog-*` tables, links to source CSS, `theme` behavior, and a copy-paste block for AI assistants.
- **[feedlog-issue readme](packages/webcomponents/src/components/feedlog-issue/readme.md#css-customization)** — issue card examples, upvote and accent gradients, and what you cannot do with variables alone (`::part`, slots).

See the [CustomCSSVars story](packages/webcomponents/src/components/feedlog-issues/feedlog-issues.stories.tsx) in Storybook for a live example. Run `npm run storybook` to explore all variants.

## 🛠 Development

From the monorepo root:

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Run Storybook (webcomponents)
npm run storybook

# Run E2E tests (builds packages and examples first)
npm run e2e
```

## 📄 License

MIT

## 🔗 Resources

- [FeedLog](https://feedlog.dev/) — Turn GitHub issues into changelogs users love
- [Stencil Documentation](https://stenciljs.com/docs/introduction)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [React Documentation](https://react.dev/)
- [Vue Documentation](https://vuejs.org/)
