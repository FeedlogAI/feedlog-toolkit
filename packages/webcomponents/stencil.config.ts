import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'feedlog-toolkit',
  validatePrimaryPackageOutputTarget: false,
  outputTargets: [
    // Hydrate module for SSR
    {
      type: 'dist-hydrate-script',
      dir: './hydrate',
    },
    // Standard web components distribution
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    // React output target - temporarily disabled due to TypeScript compatibility issues
    // reactOutputTarget({
    //   componentCorePackage: '@feedlog-ai/webcomponents',
    //   proxiesFile: '../react/src/components/stencil-generated/index.ts',
    //   includeDefineCustomElements: false,
    //   outDir: '../react/src/components/stencil-generated',
    //   hydrateModule: '@feedlog-ai/webcomponents/hydrate',
    //   clientModule: '@feedlog-ai/react',
    // }),
    // Vue output target
    vueOutputTarget({
      componentCorePackage: '@feedlog-ai/webcomponents',
      proxiesFile: '../vue/src/components.ts',
      includeDefineCustomElements: true,
      hydrateModule: '@feedlog-ai/webcomponents/hydrate',
    }),
    // Documentation
    {
      type: 'docs-readme',
    },
    // Storybook docs-json for auto-generated props documentation
    {
      type: 'docs-json',
      file: './custom-elements.json',
    },
  ],
  testing: {
    browserHeadless: 'shell',
    moduleNameMapper: {
      '^@feedlog-ai/core$': '<rootDir>/src/test/mocks/feedlog-core.ts',
    },
  },
  globalStyle: 'src/global/global.css',
};
