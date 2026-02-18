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
- **Event System**: Custom events for upvoting, theme changes, and errors

## Installation

```bash
npm install @feedlog-ai/webcomponents
```

## Components

### FeedlogGithubIssuesClient

The main component for displaying GitHub issues with built-in SDK integration.

**Props:**

- `apiKey` (required): API key for Feedlog authentication
- `type` (optional): Filter by issue type - `'bug'` or `'enhancement'`
- `limit` (optional): Maximum issues to fetch (1-100, default: 10)
- `endpoint` (optional): Custom API endpoint
- `maxWidth` (optional): Container max width (default: `'42rem'`)
- `theme` (optional): Theme variant - `'light'` or `'dark'` (default: `'light'`)
- `showThemeToggle` (optional): Show theme toggle button (default: `true`)

**Events:**

- `feedlogUpvote`: Emitted when an issue is upvoted
- `feedlogThemeChange`: Emitted when theme changes
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

The playground lets you configure:

- **API Key** (required): Feedlog authentication key
- **Type**: Filter issues by type (all/bug/enhancement)
- **Limit**: Number of issues to fetch (1-100)
- **Max Width**: Container width (CSS values)
- **Theme**: Light or dark theme
- **Heading**: Custom section heading
- **Subtitle**: Custom section subtitle

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

### React (with generated bindings)

```tsx
import React from 'react';
import { FeedlogIssuesClient } from '@feedlog-ai/webcomponents/dist/components';

function App() {
  return (
    <div>
      <feedlog-issues-client
        api-key="your-api-key"
        type="bug"
        limit={10}
        theme="light"
        max-width="42rem"
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

- `feedlog-badge`: Label component with variant support
- `feedlog-button`: Button component with variants and sizes
- `feedlog-card`: Reusable card container component
- `feedlog-issues`: Issues display component (used internally by client)
- `feedlog-issues-list`: Issues list component (used internally)

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

### feedlogThemeChange

Emitted when the theme is changed via the theme toggle.

```typescript
type ThemeEventDetail = 'light' | 'dark';
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

Components use Shadow DOM for encapsulation. You can style them using CSS custom properties. See the [main README](../../README.md#-style-customization) for full copy-paste examples.

```css
feedlog-issues-client,
feedlog-issues {
  /* Card */
  --feedlog-card-padding: 1.25rem;
  --feedlog-card-accent-width: 3px;
  --feedlog-radius: 0.625rem;
  --feedlog-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  --feedlog-shadow-hover: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
  /* Typography */
  --feedlog-title-font-size: 0.9375rem;
  --feedlog-title-font-weight: 600;
  --feedlog-body-font-size: 0.8125rem;
  --feedlog-body-line-height: 1.5;
  --feedlog-timestamp-font-size: 0.6875rem;
  /* Colors */
  --feedlog-accent-color: #2563eb;
  --feedlog-muted: #f1f5f9;
  --feedlog-muted-foreground: #64748b;
  --feedlog-border: rgba(0, 0, 0, 0.08);
}
```

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
