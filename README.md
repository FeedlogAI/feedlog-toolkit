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

Customize the changelog widget to match your product. Set CSS custom properties on the component—works with vanilla HTML, React, Vue, or any framework.

### Quick copy-paste examples

**1. Emerald theme** (serif typography, green accent):

```css
feedlog-issues-client,
feedlog-issues {
  font-family: 'Georgia', 'Times New Roman', serif;
  /* Card */
  --feedlog-card-padding: 1.5rem;
  --feedlog-card-accent-width: 5px;
  --feedlog-radius: 0.875rem;
  --feedlog-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12), 0 1px 3px -1px rgba(0, 0, 0, 0.1);
  --feedlog-shadow-hover: 0 8px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1);
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
  --feedlog-card-accent-width: 3px;
  --feedlog-radius: 0.5rem;
  --feedlog-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  --feedlog-shadow-hover: 0 2px 8px rgba(0, 0, 0, 0.08);
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

### All customizable CSS variables

| Variable                              | Description                     | Default                           |
| ------------------------------------- | ------------------------------- | --------------------------------- |
| `--feedlog-background`                | Main container background       | `#ffffff` (light)                 |
| `--feedlog-foreground`                | Main text color                 | `oklch(0.145 0 0)`                |
| `--feedlog-card`                      | Card background                 | `#ffffff` (light)                 |
| `--feedlog-card-foreground`           | Card text color                 | `oklch(0.145 0 0)`                |
| `--feedlog-padding`                   | Container padding               | `2rem`                            |
| `--feedlog-gap`                       | Gap between issue cards         | `0.5rem`                          |
| `--feedlog-card-padding`              | Card inner padding              | `1.25rem`                         |
| `--feedlog-card-accent-width`         | Left accent bar width           | `3px`                             |
| `--feedlog-radius`                    | Border radius                   | `0.625rem`                        |
| `--feedlog-shadow`                    | Card box shadow                 | (see theme)                       |
| `--feedlog-shadow-hover`              | Hover box shadow                | (see theme)                       |
| `--feedlog-title-font-size`           | Issue title size                | `0.9375rem`                       |
| `--feedlog-title-font-weight`         | Issue title weight              | `600`                             |
| `--feedlog-body-font-size`            | Body text size                  | `0.8125rem`                       |
| `--feedlog-body-line-height`          | Body line height                | `1.5`                             |
| `--feedlog-timestamp-font-size`       | Timestamp size                  | `0.6875rem`                       |
| `--feedlog-timestamp-color`           | Timestamp color                 | `var(--feedlog-muted-foreground)` |
| `--feedlog-accent-color`              | Links, badges, accent bar       | `#2563eb`                         |
| `--feedlog-muted`                     | Muted background                | `#f1f5f9`                         |
| `--feedlog-muted-foreground`          | Muted text                      | `#64748b`                         |
| `--feedlog-border`                    | Border color                    | `rgba(0,0,0,0.08)`                |
| `--feedlog-destructive`               | Bug/destructive color           | `#d4183d`                         |
| `--feedlog-icon-color`                | Icon color                      | `var(--feedlog-muted-foreground)` |
| `--feedlog-pin-color`                 | Pin icon color                  | `var(--feedlog-accent-color)`     |
| `--feedlog-upvote-icon-color`         | Upvote icon (unfilled)          | `var(--feedlog-blue-600)`         |
| `--feedlog-upvote-icon-filled-color`  | Upvote icon (filled/liked)      | `var(--feedlog-red-600)`          |
| `--feedlog-empty-illustration-bg`     | Empty state illustration bg     | `oklch(0.96 0.01 260)` (light)    |
| `--feedlog-empty-illustration-stroke` | Empty state illustration stroke | `oklch(0.75 0.02 260)` (light)    |
| `--feedlog-empty-illustration-muted`  | Empty state illustration muted  | `oklch(0.82 0.01 260)` (light)    |
| `--feedlog-badge-font-size`           | Badge font size                 | `0.75rem`                         |
| `--feedlog-badge-font-weight`         | Badge font weight               | `500`                             |
| `--feedlog-badge-padding-x`           | Badge horizontal padding        | `0.5rem`                          |
| `--feedlog-badge-padding-y`           | Badge vertical padding          | `0.125rem`                        |
| `--feedlog-badge-border-radius`       | Badge border radius             | `calc(0.625rem - 2px)`            |

See the [CustomCSSVars story](packages/webcomponents/src/components/feedlog-issues/feedlog-issues.stories.tsx) in Storybook for a live example. Run `npm run storybook` to explore all variants.

## Integrate in 3 steps

1. **Connect your repo** — Install FeedLog and pick repositories at [feedlog.dev](https://feedlog.dev/)
2. **Create your widget key** — Generate an API key in dashboard installation settings
3. **Embed and ship** — Paste one component or script on your site to show changelog updates

### Command Reference (GitHub comments)

Control your changelog from GitHub issue comments:

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `@publish`         | Publish the issue to the public changelog |
| `@unpublish`       | Remove from public changelog              |
| `@retry`           | Regenerate AI content (uses 1 retry)      |
| `@switch <number>` | Switch to a specific revision             |
| `@show <number>`   | Display full revision content             |
| `@revert`          | Revert to the previous revision           |

## 📄 License

MIT

## 🔗 Resources

- [FeedLog](https://feedlog.dev/) — Turn GitHub issues into changelogs users love
- [Stencil Documentation](https://stenciljs.com/docs/introduction)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [React Documentation](https://react.dev/)
- [Vue Documentation](https://vuejs.org/)
