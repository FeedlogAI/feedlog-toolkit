# Build with the top-level client (`@feedlog-ai/vue`)

Use **`FeedlogIssuesClient`** when you want Vue bindings and the component performs fetching internally.

## When to use

- Vue 3 (or 2 with the patterns in the main README)
- You do not need the initial HTML to already contain the issues array from your server (for that, see [BUILD_FEEDLOG_COMPOSABLE.md](./BUILD_FEEDLOG_COMPOSABLE.md))

## Install

```bash
npm install @feedlog-ai/vue
```

## Minimal example (Vue 3, Composition API)

```vue
<template>
  <FeedlogIssuesClient
    api-key="your-api-key"
    type="bug"
    :limit="10"
    theme="light"
    max-width="42rem"
    @feedlog-upvote="handleUpvote"
    @feedlog-error="handleError"
  />
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

## SSR / Nuxt

Nuxt can server-render Stencil-based Vue components as Declarative Shadow DOM in many setups. See [README](./README.md#server-side-rendering-ssr).

## See also

- [README](./README.md) — Options API, Vue 2, global registration
- [Build Your Own Feedlog hub](../../docs/BUILD_YOUR_OWN_FEEDLOG.md)
- [Customize Feedlog styling](../../docs/CUSTOMIZE_FEEDLOG_STYLING.md)
