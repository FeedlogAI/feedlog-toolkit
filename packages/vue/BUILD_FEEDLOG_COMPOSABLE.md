# Composable changelog (`@feedlog-ai/vue` + `@feedlog-ai/core`)

Fetch with **`FeedlogSDK`**, then bind the **`issues`** array to **`FeedlogIssues`** (or compose **`FeedlogIssuesList`** / **`FeedlogIssue`** for individual cards).

## When to use

- You load data in **`async setup`**, route loaders, or server APIs and pass results into the template
- You want the same data flow as React’s composable pattern, using Vue bindings instead of raw custom elements

## Install

```bash
npm install @feedlog-ai/vue @feedlog-ai/core
```

## Client fetch (Vue 3)

```vue
<template>
  <FeedlogIssues
    v-if="issues.length"
    :issues="issues"
    theme="light"
    max-width="42rem"
    @feedlog-upvote="onUpvote"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FeedlogIssues } from '@feedlog-ai/vue';
import { FeedlogSDK, type FeedlogIssue } from '@feedlog-ai/core';

const issues = ref<FeedlogIssue[]>([]);
const sdk = new FeedlogSDK({ apiKey: import.meta.env.VITE_FEEDLOG_API_KEY });

onMounted(async () => {
  const res = await sdk.fetchIssues({ limit: 10 });
  issues.value = res.issues;
});

async function onUpvote(event: CustomEvent<{ issueId: string }>) {
  await sdk.toggleUpvote(event.detail.issueId);
  const res = await sdk.fetchIssues({ limit: 10 });
  issues.value = res.issues;
}
</script>
```

## Server-provided issues (sketch)

If your framework passes serialized issues from the server (e.g. Nuxt `useAsyncData`), initialize `issues` from that payload instead of `onMounted` fetch, and keep `onUpvote` to sync with the API.

## Finer composition

- **`FeedlogIssuesList`** — list without outer section chrome
- **`FeedlogIssue`** — single issue card; pass `:issue="item"`

(Names match generated Vue exports; React uses `FeedlogIssueComponent` for the same element.)

## See also

- [@feedlog-ai/core README](../core/README.md)
- [README](./README.md)
- [Build Feedlog](../../README.md#build-feedlog)
