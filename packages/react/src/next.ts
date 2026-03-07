import stencilSSR from '@stencil/ssr/next';

export * from './server.js';

export const withFeedlogSSR = (nextConfig: Record<string, unknown>) =>
  stencilSSR({
    module: import('./server.js'),
    from: '@feedlog-ai/react/next',
    hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
    serializeShadowRoot: { default: 'declarative-shadow-dom' },
  })(nextConfig);
