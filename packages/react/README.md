# @feedlog-ai/react

React bindings for Feedlog Toolkit web components. Auto-generated from Stencil components with full TypeScript support.

## Features

- **React Components**: Native React components with JSX support
- **TypeScript Support**: Full type safety with TypeScript definitions
- **Auto-generated**: Generated from Stencil web components for consistency
- **Event Handling**: React-friendly event handling with proper typing
- **Peer Dependencies**: React >=17.0.0 and React DOM >=17.0.0
- **Tree Shakeable**: Only import the components you need

## Installation

```bash
npm install @feedlog-ai/react
```

## Components

### FeedlogGithubIssuesClient

The main component for displaying GitHub issues with built-in SDK integration.

**Props:**

- `apiKey`: API key for Feedlog authentication (required)
- `type?`: Filter by issue type - `'bug'` or `'enhancement'`
- `limit?`: Maximum issues to fetch (1-100, default: 10)
- `endpoint?`: Custom API endpoint
- `maxWidth?`: Container max width (default: `'42rem'`)
- `theme?`: Theme variant - `'light'` or `'dark'` (default: `'light'`)
- `showThemeToggle?`: Show theme toggle button (default: `true`)

**Events:**

- `onFeedlogUpvote`: Called when an issue is upvoted
- `onFeedlogThemeChange`: Called when theme changes
- `onFeedlogError`: Called on errors

## Usage

```tsx
import React from 'react';
import { FeedlogGithubIssuesClient } from '@feedlog-ai/react';

function App() {
  return (
    <div>
      <FeedlogGithubIssuesClient
        apiKey="your-api-key"
        type="bug"
        limit={10}
        theme="light"
        maxWidth="42rem"
        onFeedlogUpvote={event => {
          console.log('Issue upvoted:', event.detail);
          // event.detail contains: { issueId, upvoted, upvoteCount }
        }}
        onFeedlogThemeChange={event => {
          console.log('Theme changed to:', event.detail); // 'light' or 'dark'
        }}
        onFeedlogError={event => {
          console.error('Error occurred:', event.detail);
          // event.detail contains: { error, code? }
        }}
      />
    </div>
  );
}

export default App;
```

### Event Handling

```tsx
import React, { useCallback } from 'react';
import { FeedlogGithubIssuesClient } from '@feedlog-ai/react';

function IssuesComponent() {
  const handleUpvote = useCallback((event: CustomEvent) => {
    const { issueId, upvoted, upvoteCount } = event.detail;
    console.log(`Issue ${issueId} ${upvoted ? 'upvoted' : 'unvoted'}`);
    console.log(`New upvote count: ${upvoteCount}`);
  }, []);

  const handleThemeChange = useCallback((event: CustomEvent<'light' | 'dark'>) => {
    console.log(`Theme changed to: ${event.detail}`);
    // Update your app's theme state here
  }, []);

  const handleError = useCallback((event: CustomEvent) => {
    const { error, code } = event.detail;
    console.error(`Feedlog error (${code}):`, error);
    // Handle error in your UI
  }, []);

  return (
    <FeedlogGithubIssuesClient
      apiKey="your-api-key"
      onFeedlogUpvote={handleUpvote}
      onFeedlogThemeChange={handleThemeChange}
      onFeedlogError={handleError}
    />
  );
}
```

### With State Management

```tsx
import React, { useState, useCallback } from 'react';
import { FeedlogGithubIssuesClient } from '@feedlog-ai/react';

function IssuesWithState() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState<string | null>(null);

  const handleThemeChange = useCallback((event: CustomEvent<'light' | 'dark'>) => {
    setTheme(event.detail);
  }, []);

  const handleError = useCallback((event: CustomEvent) => {
    setError(event.detail.error);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);

  return (
    <div>
      {error && <div className="error-banner">Error: {error}</div>}

      <FeedlogGithubIssuesClient
        apiKey="your-api-key"
        theme={theme}
        onFeedlogThemeChange={handleThemeChange}
        onFeedlogError={handleError}
      />
    </div>
  );
}
```

### Other Components

The package also includes React bindings for additional UI components:

```tsx
import {
  FeedlogBadge,
  FeedlogButton,
  FeedlogCard,
  FeedlogGithubIssues,
  FeedlogIssuesList
} from '@feedlog-ai/react';

// Badge component
<FeedlogBadge variant="primary" text="New" />

// Button component
<FeedlogButton variant="primary" size="lg" onFeedlogClick={handleClick}>
  Click me
</FeedlogButton>

// Card component
<FeedlogCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</FeedlogCard>
```

## TypeScript Support

All components are fully typed. Import types from the core package if needed:

```tsx
import { FeedlogIssue } from '@feedlog-ai/core';
import { FeedlogGithubIssuesClient } from '@feedlog-ai/react';

// Type-safe event handling
const handleUpvote = (
  event: CustomEvent<{
    issueId: string;
    upvoted: boolean;
    upvoteCount: number;
  }>
) => {
  // Fully typed event detail
  console.log(event.detail.issueId);
  console.log(event.detail.upvoted);
  console.log(event.detail.upvoteCount);
};
```

## Requirements

- React >= 17.0.0
- React DOM >= 17.0.0
- Modern browsers with Web Components support

## Browser Support

Same as the underlying web components:

- Chrome 61+
- Firefox 63+
- Safari 11+
- Edge 79+

## Migration from Direct Web Components

If you're migrating from using web components directly:

```tsx
// Before (direct web component)
<feedlog-issues-client
  api-key="key"
  onFeedlogUpvote={(e) => console.log(e.detail)}
/>

// After (React component)
<FeedlogIssuesClient
  apiKey="key"
  onFeedlogUpvote={(e) => console.log(e.detail)}
/>
```

**Key differences:**

- `api-key` → `apiKey` (camelCase)
- Event handlers follow React conventions
- All props are properly typed

## License

MIT
