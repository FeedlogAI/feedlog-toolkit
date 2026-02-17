# Feedlog Toolkit

A monorepo containing the Feedlog Toolkit - a comprehensive set of packages for building GitHub issue management components and SDKs.

> **From issue chaos to changelogs users love.** FeedLog turns rough GitHub issues into clear, publish-ready changelog updates, without leaving your repo. [Get started at feedlog.dev](https://feedlog.dev/)

## 📦 Packages

This monorepo contains the following packages:

### `@feedlog-ai/core`

Core SDK package providing shared utilities, types, and functionality used across all Feedlog Toolkit packages.

**Features:**

- TypeScript-based SDK
- Shared types and interfaces
- Utility functions
- Core Feedlog SDK class

### `@feedlog-ai/webcomponents`

Stencil-based web components for GitHub issue management. These are framework-agnostic web components that can be used in any JavaScript framework or vanilla HTML.

**Features:**

- Built with [Stencil](https://stenciljs.com/)
- Web Components standard (Custom Elements, Shadow DOM)
- GitHub issue display and management components
- Tree-shakeable builds
- Auto-generated React and Vue wrappers

### `@feedlog-ai/react`

React bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- React components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on React >=17.0.0

### `@feedlog-ai/vue`

Vue bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- Vue 3 components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on Vue >=3.0.0 or >=2.6.0

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm install

# Build all packages
npm run build
```

### Development

```bash
# Start development server for web components
npm run dev

# Lint all packages
npm run lint

# Format all code
npm run format
```

## 📝 Building Packages

### Build Order

Packages should be built in this order due to dependencies:

1. **Core SDK** - No dependencies
2. **Web Components** - Depends on core
3. **React & Vue** - Generated from web components build

### Individual Package Builds

```bash
# Build core SDK
npm run build:core

# Build web components (this also generates React/Vue wrappers)
npm run build:webcomponents

# Build React package
npm run build:react

# Build Vue package
npm run build:vue
```

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
    <feedlog-github-issues-client
      api-key="your-api-key"
      type="bug"
      limit="10"
      theme="light"
      max-width="42rem"
    >
    </feedlog-github-issues-client>
  </body>
</html>
```

### Using React Components

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
  <feedlog-github-issues-client
    api-key="your-api-key"
    type="bug"
    :limit="10"
    theme="light"
    max-width="42rem"
    @feedlog-upvote="handleUpvote"
    @feedlog-error="handleError"
  >
  </feedlog-github-issues-client>
</template>

<script setup lang="ts">
import { FeedlogGithubIssuesClient } from '@feedlog-ai/vue';

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
feedlog-github-issues-client,
feedlog-github-issues {
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
feedlog-github-issues-client,
feedlog-github-issues {
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
feedlog-github-issues-client,
feedlog-github-issues {
  --feedlog-accent-color: #7c3aed; /* purple */
  /* Or: #dc2626 (red), #0891b2 (cyan), #ea580c (orange) */
}
```

### All customizable CSS variables

| Variable                        | Description               | Default            |
| ------------------------------- | ------------------------- | ------------------ |
| `--feedlog-card-padding`        | Card inner padding        | `1.25rem`          |
| `--feedlog-card-accent-width`   | Left accent bar width     | `3px`              |
| `--feedlog-radius`              | Border radius             | `0.625rem`         |
| `--feedlog-shadow`              | Card box shadow           | (see theme)        |
| `--feedlog-shadow-hover`        | Hover box shadow          | (see theme)        |
| `--feedlog-title-font-size`     | Issue title size          | `0.9375rem`        |
| `--feedlog-title-font-weight`   | Issue title weight        | `600`              |
| `--feedlog-body-font-size`      | Body text size            | `0.8125rem`        |
| `--feedlog-body-line-height`    | Body line height          | `1.5`              |
| `--feedlog-timestamp-font-size` | Timestamp size            | `0.6875rem`        |
| `--feedlog-accent-color`        | Links, badges, accent bar | `#2563eb`          |
| `--feedlog-muted`               | Muted background          | `#f1f5f9`          |
| `--feedlog-muted-foreground`    | Muted text                | `#64748b`          |
| `--feedlog-border`              | Border color              | `rgba(0,0,0,0.08)` |
| `--feedlog-destructive`         | Bug/destructive color     | `#d4183d`          |

See the [CustomCSSVars story](packages/webcomponents/src/components/feedlog-github-issues/feedlog-github-issues.stories.tsx) in Storybook for a live example. Run `npm run storybook` to explore all variants.

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

## 🛠️ Development Workflow

### Adding a New Component

1. Create a new component in `packages/webcomponents/src/components/`
2. Run `npm run build:webcomponents` to generate React/Vue wrappers
3. The wrappers will be automatically updated in `packages/react` and `packages/vue`

### Creating a New Component with Stencil

```bash
# Navigate to the webcomponents package
cd packages/webcomponents

# Generate a new component
npm run generate
# Follow the prompts to create a new component

# Build the webcomponents package (this also generates React/Vue wrappers)
npm run build
```

## 🚀 Publishing & CI/CD

### Automated Releases

This project uses GitHub Actions for automated CI/CD:

- **CI Workflow**: Runs on every push/PR to `main`/`master` branches
  - Uses Node.js 22.x
  - Installs dependencies
  - Runs linting and formatting checks
  - Executes test suites with coverage
  - Builds all packages

- **Release Workflow**: Triggers on version tags (`v*.*.*`)
  - Uses Node.js 22.x
  - Runs full CI checks
  - Publishes all packages to npm
  - Creates a GitHub release

### Publishing a Release

1. **Update versions and create release**:

   ```bash
   # Increment patch version (default)
   npm run release

   # Or specify version type
   npm run release minor  # 0.0.1 → 0.1.0
   npm run release major  # 0.0.1 → 1.0.0
   ```

2. **Push to GitHub**:

   ```bash
   git push && git push --tags
   ```

3. **GitHub Actions will automatically**:
   - Build all packages
   - Publish to npm (requires `NPM_TOKEN` secret)
   - Create a GitHub release

### Required GitHub Secrets

For automated publishing, set these secrets in your GitHub repository:

- `NPM_TOKEN`: npm authentication token with publish permissions
- `CODECOV_TOKEN`: Optional, for code coverage reporting

### Manual Publishing

If you need to publish manually:

```bash
# Build all packages
npm run build

# Publish each package
cd packages/core && npm publish
cd ../webcomponents && npm publish
cd ../react && npm publish
cd ../vue && npm publish
```

## 📋 Scripts Reference

### Root Scripts

**Build Commands:**

- `npm run build` - Build all packages in dependency order
- `npm run build:core` - Build only the core package
- `npm run build:webcomponents` - Build web components (generates React/Vue wrappers)
- `npm run build:react` - Build React package
- `npm run build:vue` - Build Vue package

**Development:**

- `npm run dev` - Start development server for web components
- `npm run storybook` - Start Storybook for component development

**Testing:**

- `npm run test` - Run tests for all packages
- `npm run test:core` - Run tests for core package
- `npm run test:webcomponents` - Run tests for web components
- `npm run test:react` - Run tests for React package
- `npm run test:vue` - Run tests for Vue package
- `npm run test:coverage` - Run tests with coverage for all packages

**Code Quality:**

- `npm run lint` - Lint all packages
- `npm run lint:fix` - Lint and auto-fix issues
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check code formatting

**Maintenance:**

- `npm run clean` - Clean all build artifacts and node_modules
- `npm run release` - Update versions and prepare release (patch by default)
- `npm run release minor` - Prepare minor version release
- `npm run release major` - Prepare major version release

### Package-Specific Scripts

Each package has additional scripts defined in its `package.json`:

**Web Components Package:**

- `npm run generate` - Generate new Stencil components
- `npm run storybook` - Start Storybook for web components
- `npm run build-storybook` - Build Storybook static site

Use `npm run <script> --workspace=<package-name>` to run package-specific scripts.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Submit a pull request

## 📄 License

MIT

## 🔗 Resources

- [FeedLog](https://feedlog.dev/) — Turn GitHub issues into changelogs users love
- [Stencil Documentation](https://stenciljs.com/docs/introduction)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [React Documentation](https://react.dev/)
- [Vue Documentation](https://vuejs.org/)
