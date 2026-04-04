# @feedlog-ai/webcomponents

Stencil-based web components for GitHub issue management. These are framework-agnostic web components that can be used in any JavaScript framework or vanilla HTML.

## Features

- **Framework Agnostic**: Built with [Stencil](https://stenciljs.com/) - works with any JavaScript framework or vanilla HTML
- **Web Components Standard**: Uses Custom Elements, Shadow DOM for true encapsulation
- **GitHub Issue Management**: Complete solution for displaying and interacting with GitHub issues
- **Auto-generated Framework Bindings**: React and Vue wrappers generated automatically
- **Tree-shakeable**: Multiple output formats for optimal bundle sizes
- **TypeScript Support**: Full type safety with generated TypeScript definitions
- **Theme Support**: Built-in light/dark theme switching
- **Event System**: Custom events for upvoting and errors

## Installation

```bash
npm install @feedlog-ai/webcomponents
```

## Server-side rendering (SSR) and Node

Imports of these components are evaluated in Node for SSR (for example Vite dev, TanStack Start, or other frameworks that run the same ESM graph on the server). The package aligns with that environment: shared code from `@feedlog-ai/core` and markdown rendering ensure browser-only globals such as `self` are defined on `globalThis` before sanitization libraries load, so you should not need an app-level `self` polyfill for normal usage.

Custom elements still rely on a DOM in the browser for full behavior; use the [Stencil hydrate bundle](https://stenciljs.com/docs/hydrate-app) (`@feedlog-ai/webcomponents/hydrate`) or your framework’s integration (for example `@feedlog-ai/react` with `feedlogSSR()`) for SSR patterns that hydrate on the client.

## Components

### FeedlogIssuesClient

The main component for displaying GitHub issues with built-in SDK integration.

**Props:**

- `apiKey` (required): API key for Feedlog authentication (set via property; not reflected to an HTML attribute)
- `type` (optional): Filter by issue type — `'bug'` or `'enhancement'`
- `limit` (optional): Maximum issues per page (1–100; default from API when omitted)
- `sortBy` (optional): `'createdAt'` or `'updatedAt'`
- `endpoint` (optional): Custom API endpoint
- `maxWidth` (optional): Container max width (default: `'42rem'`)
- `paginationType` (optional): `'load-more'` or `'prev-next'` (default: `'load-more'`)
- `loadMoreLabel` (optional): Label for the load-more button (default: `'Load More'`)
- `minSkeletonTime` (optional): Minimum ms to show skeleton UI before showing data (default: `250`)
- `theme` (optional): `'light'` or `'dark'` (default: `'light'`)
- `heading` / `subtitle` (optional): Section heading and subtitle
- `emptyStateTitle` / `emptyStateMessage` (optional): Copy for the empty state
- `getIssueUrl` (optional): Callback `(issue) => string | null | undefined` when `githubIssueLink` is missing (privacy-safe URLs)

**Events:**

- `feedlogUpvote`: Emitted when an issue is upvoted
- `feedlogError`: Emitted on errors

## Playground (Development & Testing)

For fast prototyping and debugging without publishing changes, use the interactive playground:

### Quick Start

1. **Build the components:**

   ```bash
   npm run build
   ```

2. **Open the playground:**
   - **Option A**: Open `playground.html` directly in your browser (file://)
   - **Option B**: Use a local server for better development experience:
     ```bash
     npx serve .
     ```
     Then visit `http://localhost:3000/playground.html`

3. **Use the playground:**
   - Enter your Feedlog API key in the "API Key" field
   - Adjust filter settings (type, limit, theme, etc.)
   - Click "Update Component" to render the component
   - Monitor component events in the "Event Log & Debug Console"
   - Your API key is automatically saved to localStorage for convenience

### Development Workflow

For continuous development with live reloading:

```bash
# Terminal 1: Watch and build components
npm run dev

# Terminal 2: Serve the package directory
npx serve .
```

Then visit `http://localhost:3000/playground.html` and refresh after each build.

### Features

- **Interactive Controls**: Change props in real-time without rebuilding
- **Event Log**: See all component events (upvotes, errors) with timestamps
- **Status Badge**: Visual feedback on component state
- **No Publishing Required**: Test changes instantly without npm publish
- **Persistent Settings**: API key is saved to browser localStorage
- **Light/Dark Theme**: Toggle themes to test both variants
- **Responsive Design**: Test on different screen sizes

### Playground Props

The playground UI exposes:

- **API Key** (required): Feedlog authentication key
- **Endpoint**: API base URL (defaults to a local dev URL; adjust for your environment)
- **Type**: Filter issues by type (all/bug/enhancement)
- **Limit**: Number of issues to fetch (1-100)
- **Max Width**: Container width (CSS values)
- **Theme**: Light or dark theme
- **Heading** / **Subtitle**: Optional section copy

Additional props (`sort-by`, `pagination-type`, `empty-state-*`, `getIssueUrl`, etc.) are available on `<feedlog-issues-client>` in your own markup or by setting properties in JavaScript; see [feedlog-issues-client readme](src/components/feedlog-issues-client/readme.md).

## Usage

### Vanilla HTML

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

    <script>
      // Listen for events
      const client = document.querySelector('feedlog-issues-client');

      client.addEventListener('feedlogUpvote', event => {
        console.log('Issue upvoted:', event.detail);
      });

      client.addEventListener('feedlogError', event => {
        console.error('Error:', event.detail);
      });
    </script>
  </body>
</html>
```

### React

For React apps, use the dedicated `@feedlog-ai/react` package for better integration:

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

### Vue (with generated bindings)

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
const handleUpvote = (event: CustomEvent) => {
  console.log('Issue upvoted:', event.detail);
};

const handleError = (event: CustomEvent) => {
  console.error('Error:', event.detail);
};
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <feedlog-issues-client
      api-key="your-api-key"
      type="bug"
      limit="10"
      theme="light"
      max-width="42rem"
      (feedlogUpvote)="onUpvote($event)"
      (feedlogError)="onError($event)"
    >
    </feedlog-issues-client>
  `,
})
export class AppComponent {
  onUpvote(event: CustomEvent) {
    console.log('Issue upvoted:', event.detail);
  }

  onError(event: CustomEvent) {
    console.error('Error:', event.detail);
  }
}
```

## Other Components

The package also includes additional UI components:

- `feedlog-badge`: Label component (`variant`: `default`, `destructive`, `enhancement`, `secondary`)
- `feedlog-button`: Button component with variants and sizes
- `feedlog-card`: Reusable card container (header / content / footer slots)
- `feedlog-issue`: Single issue card
- `feedlog-issues`: Full list + loading, error, and pagination (composable with `FeedlogSDK`; also used by the client)
- `feedlog-issues-list`: List of issue cards only

Per-component API tables live in `src/components/<name>/readme.md` (Stencil-generated).

## Build Outputs

The package provides multiple build formats:

- **ESM**: `dist/feedlog-toolkit/feedlog-toolkit.esm.js` - Modern ES modules
- **CommonJS**: `dist/index.cjs.js` - Node.js compatible
- **Loader**: `loader/` - Dynamic loader for different environments

## Events

### feedlogUpvote

Emitted when a user upvotes or removes an upvote from an issue.

```typescript
interface UpvoteEventDetail {
  issueId: string;
  upvoted: boolean; // true if added, false if removed
  upvoteCount: number; // Updated total count
}
```

### feedlogError

Emitted when an error occurs during API calls or other operations.

```typescript
interface ErrorEventDetail {
  error: string; // Error message
  code?: number; // HTTP status code (if applicable)
}
```

## Styling

Components use Shadow DOM for encapsulation. Theme them with CSS custom properties on `feedlog-issues-client` or `feedlog-issues` (they inherit into nested components).

- **[Customize Feedlog styling](../../docs/CUSTOMIZE_FEEDLOG_STYLING.md)** — full `--feedlog-*` reference and source file links
- **[Main README quick examples](../../README.md#-style-customization)** — copy-paste themes
- **[feedlog-issue readme](src/components/feedlog-issue/readme.md#css-customization)** — card, upvote, `::part` / slots

```css
feedlog-issues-client,
feedlog-issues {
  --feedlog-accent-color: #2563eb;
  --feedlog-card-padding: 1.25rem;
  --feedlog-radius: 0.625rem;
}
```

## Build your own changelog

- [Build Feedlog](../../README.md#build-feedlog) — three tiers and AI copy-paste blocks
- [Top-level client](./BUILD_FEEDLOG_CLIENT.md) — `<feedlog-issues-client>`
- [Composable + your data](./BUILD_FEEDLOG_COMPOSABLE.md) — `FeedlogSDK` + `<feedlog-issues>`

## Requirements

- Modern browsers with Web Components support
- ES2017+ for modern builds
- For older browsers, use the loader build

## Browser Support

- Chrome 61+
- Firefox 63+
- Safari 11+
- Edge 79+

## License

MIT
