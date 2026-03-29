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

## Build Your Own Feedlog

Pick how much you own: **all-in-one client** (built-in fetch), **composable UI** (you fetch with `FeedlogSDK`, Feedlog renders the list), or **core-only** (your markup, SDK for data and upvotes). See [Build Your Own Feedlog](docs/BUILD_YOUR_OWN_FEEDLOG.md) for the overview, links to per-package guides, and copy-paste blocks for AI assistants.

To theme the widget with **CSS only** (no custom data flow), see [Customize Feedlog styling](docs/CUSTOMIZE_FEEDLOG_STYLING.md).

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
