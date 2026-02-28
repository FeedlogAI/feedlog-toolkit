import stencilSSR from '@stencil/ssr/next';

export const withFeedlogSSR = (nextConfig: Record<string, unknown>) =>
  stencilSSR({
    module: import('@feedlog-ai/react'),
    from: '@feedlog-ai/react',
    hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
    serializeShadowRoot: { default: 'declarative-shadow-dom' },
  })(nextConfig);
