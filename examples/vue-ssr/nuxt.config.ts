export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  vite: {
    build: {
      rollupOptions: {
        external: ['@feedlog-ai/webcomponents/hydrate'],
      },
    },
    ssr: {
      noExternal: ['@feedlog-ai/vue', '@feedlog-ai/webcomponents'],
    },
  },
});
