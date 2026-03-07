# Feedlog SSR Examples

This directory contains example applications demonstrating Server-Side Rendering (SSR) with Feedlog Toolkit components.

## Prerequisites

From the monorepo root, install dependencies and build packages:

```bash
npm install
npm run build
```

## Examples

### 1. Webcomponent SSR (Vanilla HTML + Express)

Uses the Stencil hydrate module directly with Express to server-render web components.

```bash
cd examples/webcomponent-ssr
npm start
```

Open http://localhost:3001

### 2. React SSR (Next.js)

Uses `withFeedlogSSR` from `@feedlog-ai/react/next` to enable compiler-based SSR for Feedlog components in Next.js.

```bash
cd examples/react-ssr
npm run dev
```

Open http://localhost:3002

### 3. Vue SSR (Nuxt)

Uses the Vue output target with `hydrateModule` - Nuxt automatically picks up the SSR configuration.

```bash
cd examples/vue-ssr
npm run dev
```

Open http://localhost:3003

## E2E Tests

Run E2E tests from the monorepo root:

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run E2E tests
npm run e2e
```

This builds all packages and examples, then runs Playwright tests to verify SSR output and hydration.
