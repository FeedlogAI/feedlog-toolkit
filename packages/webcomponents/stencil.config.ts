import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'feedlog-toolkit',
  validatePrimaryPackageOutputTarget: false,
  outputTargets: [
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
    // }),
    // Vue output target
    vueOutputTarget({
      componentCorePackage: '@feedlog-ai/webcomponents',
      proxiesFile: '../vue/src/components.ts',
      includeDefineCustomElements: true,
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
  },
  globalStyle: 'src/global/global.css',
};
