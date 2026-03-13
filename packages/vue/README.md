# @feedlog-ai/vue

Vue bindings for Feedlog Toolkit web components. Auto-generated from Stencil components with full TypeScript support.

## Features

- **Vue Components**: Native Vue components with template syntax support
- **TypeScript Support**: Full type safety with TypeScript definitions
- **Auto-generated**: Generated from Stencil web components for consistency
- **Vue 2 & 3 Support**: Compatible with Vue >=2.6.0 and >=3.0.0
- **Event Handling**: Vue-friendly event handling with proper typing
- **Tree Shakeable**: Only import the components you need

## Installation

```bash
npm install @feedlog-ai/vue
```

## Server-Side Rendering (SSR)

The Vue components fully support Server-Side Rendering (SSR).

If you are using **Nuxt**, no additional configuration is required! Nuxt will automatically detect and server-side render the Stencil web components as Declarative Shadow DOM and hydrate them on the client. Just install and use them normally.

## Components

### FeedlogIssuesClient

The main component for displaying issues with built-in SDK integration.

**Props:**

- `apiKey`: API key for Feedlog authentication (required)
- `type?`: Filter by issue type - `'bug'` or `'enhancement'`
- `limit?`: Maximum issues to fetch (1-100, default: 10)
- `endpoint?`: Custom API endpoint
- `maxWidth?`: Container max width (default: `'42rem'`)
- `theme?`: Theme variant - `'light'` or `'dark'` (default: `'light'`)

**Events:**

- `@feedlog-upvote`: Emitted when an issue is upvoted
- `@feedlog-error`: Emitted on errors

## Usage

### Vue 3 (Composition API)

```vue
<template>
  <div>
    <FeedlogIssuesClient
      api-key="your-api-key"
      type="bug"
      :limit="10"
      theme="light"
      max-width="42rem"
      @feedlog-upvote="handleUpvote"
      @feedlog-error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { FeedlogIssuesClient } from '@feedlog-ai/vue';

const handleUpvote = (event: CustomEvent) => {
  console.log('Issue upvoted:', event.detail);
  // event.detail: { issueId, upvoted, upvoteCount }
};

const handleError = (event: CustomEvent) => {
  console.error('Error:', event.detail);
  // event.detail: { error, code? }
};
</script>
```

### Vue 3 (Options API)

```vue
<template>
  <FeedlogIssuesClient api-key="your-api-key" @feedlog-upvote="onUpvote" @feedlog-error="onError" />
</template>

<script lang="ts">
import { FeedlogIssuesClient } from '@feedlog-ai/vue';

export default {
  components: {
    FeedlogIssuesClient,
  },
  methods: {
    onUpvote(event: CustomEvent) {
      console.log('Issue upvoted:', event.detail);
    },
    onError(event: CustomEvent) {
      console.error('Error:', event.detail);
    },
  },
};
</script>
```

### Vue 2

```vue
<template>
  <feedlog-issues-client api-key="your-api-key" @feedlog-upvote="handleUpvote" />
</template>

<script>
import { FeedlogIssuesClient } from '@feedlog-ai/vue';

export default {
  components: {
    FeedlogIssuesClient,
  },
  methods: {
    handleUpvote(event) {
      console.log('Issue upvoted:', event.detail);
    },
  },
};
</script>
```

### With Reactive Data

```vue
<template>
  <div>
    <div class="controls">
      <select v-model="issueType">
        <option value="bug">Bugs</option>
        <option value="enhancement">Enhancements</option>
      </select>

      <button @click="toggleTheme">
        Switch to {{ theme === 'light' ? 'dark' : 'light' }} theme
      </button>
    </div>

    <FeedlogIssuesClient api-key="your-api-key" :type="issueType" :theme="theme" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FeedlogIssuesClient } from '@feedlog-ai/vue';

const issueType = ref<'bug' | 'enhancement'>('bug');
const theme = ref<'light' | 'dark'>('light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>
```

### Event Handling

```vue
<template>
  <FeedlogIssuesClient api-key="your-api-key" @feedlog-upvote="onUpvote" @feedlog-error="onError" />
</template>

<script setup lang="ts">
const onUpvote = (
  event: CustomEvent<{
    issueId: string;
    upvoted: boolean;
    upvoteCount: number;
  }>
) => {
  // Fully typed event detail
  const { issueId, upvoted, upvoteCount } = event.detail;

  if (upvoted) {
    console.log(`User upvoted issue ${issueId}`);
  } else {
    console.log(`User removed upvote from issue ${issueId}`);
  }

  console.log(`Issue now has ${upvoteCount} upvotes`);
};

const onError = (
  event: CustomEvent<{
    error: string;
    code?: number;
  }>
) => {
  const { error, code } = event.detail;
  console.error(`Feedlog error (${code || 'unknown'}):`, error);

  // Handle error in your UI (show toast, etc.)
};
</script>
```

### Other Components

The package also includes Vue bindings for additional UI components:

```vue
<template>
  <div>
    <!-- Badge component -->
    <FeedlogBadge variant="primary">New</FeedlogBadge>

    <!-- Button component -->
    <FeedlogButton variant="primary" size="lg" @feedlog-click="handleClick">
      Click me
    </FeedlogButton>

    <!-- Card component -->
    <FeedlogCard>
      <h3>Card Title</h3>
      <p>Card content</p>
    </FeedlogCard>
  </div>
</template>

<script setup lang="ts">
import { FeedlogBadge, FeedlogButton, FeedlogCard } from '@feedlog-ai/vue';

const handleClick = (event: CustomEvent<MouseEvent>) => {
  console.log('Button clicked:', event.detail);
};
</script>
```

## Global Registration

You can register components globally in your Vue app:

```ts
// main.ts
import { createApp } from 'vue';
import { FeedlogIssuesClient, FeedlogBadge } from '@feedlog-ai/vue';

const app = createApp(App);

// Register specific components
app.component('FeedlogIssuesClient', FeedlogIssuesClient);
app.component('FeedlogBadge', FeedlogBadge);

// Or use the install function (currently minimal but extensible)
import { install } from '@feedlog-ai/vue';
app.use(install);
```

## TypeScript Support

All components are fully typed. Import types from the core package if needed:

```vue
<script setup lang="ts">
import type { FeedlogIssue } from '@feedlog-ai/core';

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
</script>
```

## Requirements

- Vue >= 2.6.0 or >= 3.0.0
- Modern browsers with Web Components support

## Browser Support

Same as the underlying web components:

- Chrome 61+
- Firefox 63+
- Safari 11+
- Edge 79+

## Migration from Direct Web Components

If you're migrating from using web components directly:

```vue
<!-- Before (direct web component) -->
<feedlog-issues-client api-key="key" @feedlog-upvote="handleUpvote" />

<!-- After (Vue component) -->
<FeedlogIssuesClient api-key="key" @feedlog-upvote="handleUpvote" />
```

**Key differences:**

- Use PascalCase component names in templates
- Event names remain the same (kebab-case)
- All props and events are properly typed

## License

MIT
