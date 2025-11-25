import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'feedlog-toolkit',
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
    // React output target
    reactOutputTarget({
      componentCorePackage: '@feedlog-toolkit/webcomponents',
      proxiesFile: '../react/src/components/stencil-generated/index.ts',
      includeDefineCustomElements: true,
    }),
    // Vue output target
    vueOutputTarget({
      componentCorePackage: '@feedlog-toolkit/webcomponents',
      proxiesFile: '../vue/src/components.ts',
      includeDefineCustomElements: true,
    }),
    // Documentation
    {
      type: 'docs-readme',
    },
    // Collection for lazy loading
    {
      type: 'dist-collection',
      dir: 'dist/collection',
      collectionDir: 'collection',
    },
  ],
  testing: {
    browserHeadless: true,
  },
  globalStyle: 'src/global/global.css',
};
