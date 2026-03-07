<template>
  <main style="padding: 2rem; font-family: system-ui">
    <h1>Feedlog Vue SSR Example</h1>
    <p>Components below are server-side rendered via Nuxt (Vue output target with hydrateModule):</p>
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem">
      <FeedlogBadge variant="primary">SSR Badge</FeedlogBadge>
      <FeedlogButton variant="primary" size="md">SSR Button</FeedlogButton>
      <FeedlogCard>
        <div slot="header">
          <h2>SSR Card</h2>
        </div>
        <div slot="content">
          <p>This card content was rendered on the server.</p>
        </div>
      </FeedlogCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { FeedlogBadge, FeedlogButton, FeedlogCard } from '@feedlog-ai/vue';
</script>
