# Feedlog Toolkit

A monorepo containing the Feedlog Toolkit - a comprehensive set of packages for building data visualization components and SDKs.

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

Stencil-based web components for data visualization. These are framework-agnostic web components that can be used in any JavaScript framework or vanilla HTML.

**Features:**

- Built with [Stencil](https://stenciljs.com/)
- Web Components standard (Custom Elements, Shadow DOM)
- Data visualization components
- Tree-shakeable builds
- Auto-generated React and Vue wrappers

### `@feedlog-toolkit/react`

React bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- React components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on React >=16.8.0

### `@feedlog-toolkit/vue`

Vue bindings for Feedlog Toolkit web components. Auto-generated from Stencil components.

**Features:**

- Vue 3 components with TypeScript support
- Auto-generated from Stencil components
- Full type safety
- Peer dependency on Vue >=3.0.0 or >=2.6.0

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
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
│   ├── core/              # Core SDK package
│   │   ├── src/
│   │   │   ├── types/     # TypeScript types
│   │   │   ├── utils/     # Utility functions
│   │   │   └── index.ts   # Main exports
│   │   └── package.json
│   ├── webcomponents/     # Stencil web components
│   │   ├── src/
│   │   │   ├── components/  # Stencil components
│   │   │   └── global/      # Global styles
│   │   ├── stencil.config.ts
│   │   └── package.json
│   ├── react/             # React wrappers
│   │   ├── src/
│   │   │   └── components/
│   │   │       └── stencil-generated/  # Auto-generated React components
│   │   └── package.json
│   └── vue/               # Vue wrappers
│       ├── src/
│       │   └── components.ts  # Auto-generated Vue components
│       └── package.json
├── package.json           # Root package.json with workspaces
├── tsconfig.json          # Root TypeScript config
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
```

## 📚 Usage Examples

### Using Core SDK

```typescript
import { FeedlogSDK } from '@feedlog-toolkit/core';

const sdk = new FeedlogSDK('your-api-key');
sdk.initialize({ apiKey: 'your-api-key' });
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
    <feedlog-chart type="line" title="My Chart" data='[{"x": 1, "y": 2}, {"x": 2, "y": 3}]'>
    </feedlog-chart>
  </body>
</html>
```

### Using React Components

```tsx
import React from 'react';
import { FeedlogChart } from '@feedlog-toolkit/react';

function App() {
  const chartData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
  ];

  return <FeedlogChart type="line" title="My Chart" data={chartData} />;
}
```

### Using Vue Components

```vue
<template>
  <feedlog-chart type="line" title="My Chart" :data="chartData" />
</template>

<script setup lang="ts">
import { FeedlogChart } from '@feedlog-toolkit/vue';

const chartData = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
];
</script>
```

## 🛠️ Development Workflow

### Adding a New Component

1. Create a new component in `packages/webcomponents/src/components/`
2. Run `npm run build:webcomponents` to generate React/Vue wrappers
3. The wrappers will be automatically updated in `packages/react` and `packages/vue`

### Creating a New Component with Stencil

```bash
cd packages/webcomponents
npm run generate
# Follow the prompts to create a new component
```

## 📋 Scripts Reference

### Root Scripts

- `npm run build` - Build all packages
- `npm run dev` - Start development server for web components
- `npm run lint` - Lint all packages
- `npm run format` - Format all code with Prettier
- `npm run clean` - Clean all build artifacts

### Package-Specific Scripts

Each package has its own scripts defined in its `package.json`. Use `npm run <script> --workspace=<package-name>` to run them.

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
