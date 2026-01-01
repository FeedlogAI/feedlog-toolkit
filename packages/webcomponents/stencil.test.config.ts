import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'feedlog-toolkit',
  // Minimal config for testing - no output targets that trigger rollup
  outputTargets: [],
  testing: {
    browserHeadless: 'shell',
  },
  globalStyle: 'src/global/global.css',
};
