# Feedlog Toolkit

A monorepo containing the Feedlog Toolkit - a comprehensive set of packages for building GitHub issue management components and SDKs.

## 📦 Packages

This monorepo contains the following packages:

### `@feedlog-toolkit/core`

Core SDK package providing shared utilities, types, and functionality used across all Feedlog Toolkit packages.

**Features:**

- TypeScript-based SDK
- Shared types and interfaces
- Utility functions
- Core Feedlog SDK class

### `@feedlog-toolkit/webcomponents`

Stencil-based web components for GitHub issue management. These are framework-agnostic web components that can be used in any JavaScript framework or vanilla HTML.

**Features:**

- Built with [Stencil](https://stenciljs.com/)
- Web Components standard (Custom Elements, Shadow DOM)
- GitHub issue display and management components
- Tree-shakeable builds
- Auto-generated React and Vue wrappers

### `@feedlog-toolkit/react`

React bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- React components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on React >=17.0.0

### `@feedlog-toolkit/vue`

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

## 🏗️ Project Structure

```
feedlog-toolkit/
├── packages/
│   ├── core/                    # Core SDK package
│   │   ├── src/
│   │   │   ├── __tests__/       # Unit tests
│   │   │   ├── types/           # TypeScript types
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── errors.ts        # Error handling
│   │   │   └── index.ts         # Main exports
│   │   ├── dist/                # Compiled output
│   │   ├── jest.config.js       # Jest configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── webcomponents/           # Stencil web components
│   │   ├── src/
│   │   │   ├── components/      # Stencil components
│   │   │   │   ├── feedlog-badge/
│   │   │   │   ├── feedlog-button/
│   │   │   │   ├── feedlog-card/
│   │   │   │   ├── feedlog-github-issues/
│   │   │   │   └── ...
│   │   │   ├── global/          # Global styles
│   │   │   └── index.ts
│   │   ├── collection/          # Stencil collection output
│   │   ├── dist/                # Build output (esm, cjs, types)
│   │   ├── loader/              # Script loader utilities
│   │   ├── scripts/             # Build scripts
│   │   ├── storybook-static/    # Storybook build output
│   │   ├── stencil.config.ts
│   │   ├── stencil.test.config.ts
│   │   ├── custom-elements.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── react/                   # React wrappers
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   │   └── stencil-generated/  # Auto-generated React components
│   │   │   └── index.ts
│   │   ├── dist/                # Compiled output
│   │   ├── jest.config.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.stencil-generated.json
│   │   └── tsconfig.stencil.json
│   └── vue/                     # Vue wrappers
│       ├── src/
│       │   ├── __tests__/
│       │   ├── components.ts    # Auto-generated Vue components
│       │   ├── vue-component-lib/
│       │   │   └── utils.ts     # Vue-specific utilities
│       │   └── index.ts
│       ├── dist/                # Compiled output
│       ├── jest.config.js
│       ├── package.json
│       └── tsconfig.json
├── scripts/
│   └── release.js               # Release automation script
├── .github/
│   └── workflows/               # GitHub Actions CI/CD
├── package.json                 # Root package.json with workspaces
├── tsconfig.json                # Root TypeScript config
├── README.md
└── [config files]               # ESLint, Prettier, etc.
```

## 📚 Usage Examples

### Using Core SDK

```typescript
import { FeedlogSDK } from '@feedlog-toolkit/core';

// Initialize with default configuration
const sdk = new FeedlogSDK();

// Or initialize with custom configuration
const customSdk = new FeedlogSDK({
  endpoint: 'https://api.feedlog.app', // Custom API endpoint (optional)
  timeout: 30000, // Request timeout in milliseconds (optional)
  credentials: 'include', // Fetch credentials mode (optional)
});

// Fetch issues
const issues = await sdk.fetchIssues({
  repositoryIds: 'your-repo-id',
  type: 'bug', // 'bug' or 'enhancement'
  limit: 10,
});

// Toggle upvote on an issue
const upvoteResult = await sdk.toggleUpvote('issue-id');
```

### Using Web Components (Vanilla HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="/node_modules/@feedlog-toolkit/webcomponents/dist/feedlog-toolkit/feedlog-toolkit.esm.js"
    ></script>
  </head>
  <body>
    <feedlog-card title="My Card" content="Hello World!"></feedlog-card>
    <feedlog-badge variant="primary" text="New"></feedlog-badge>
    <feedlog-button variant="primary">Click me</feedlog-button>
  </body>
</html>
```

### Using React Components

```tsx
import React from 'react';
import { FeedlogCard, FeedlogBadge, FeedlogButton } from '@feedlog-toolkit/react';

function App() {
  return (
    <div>
      <FeedlogCard title="My Card" content="Hello World!" />
      <FeedlogBadge variant="primary" text="New" />
      <FeedlogButton variant="primary">Click me</FeedlogButton>
    </div>
  );
}
```

### Using Vue Components

```vue
<template>
  <feedlog-card title="My Card" content="Hello World!" />
  <feedlog-badge variant="primary" text="New" />
  <feedlog-button variant="primary">Click me</feedlog-button>
</template>

<script setup lang="ts">
import { FeedlogCard, FeedlogBadge, FeedlogButton } from '@feedlog-toolkit/vue';
</script>
```

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

- [Stencil Documentation](https://stenciljs.com/docs/introduction)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [React Documentation](https://react.dev/)
- [Vue Documentation](https://vuejs.org/)
