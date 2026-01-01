import type { StorybookConfig } from '@storybook/core/types';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: {
    name: '@stencil/storybook-plugin',
  },
  async viteFinal(config) {
    // Configure Vite to properly handle module resolution
    config.resolve = config.resolve || {};

    // Resolve paths using process.cwd()
    const packageRoot = process.cwd();
    const distPath = path.resolve(packageRoot, 'dist');
    const loaderPath = path.resolve(packageRoot, 'loader');

    config.resolve.alias = {
      ...config.resolve.alias,
      // Map absolute /dist paths to the actual dist directory
      '/dist': distPath,
    };

    // Exclude dist from optimization to prevent resolution issues
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      '@feedlog-toolkit/webcomponents/dist',
    ];

    // Configure server to allow access to dist, loader, and package root
    config.server = config.server || {};
    config.server.fs = config.server.fs || {};
    config.server.fs.allow = [
      ...(config.server.fs.allow || []),
      distPath,
      loaderPath,
      packageRoot, // Allow access to package root for custom-elements.json
    ];

    return config;
  },
};

export default config;
