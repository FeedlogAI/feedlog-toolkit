import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import stencilSSR from '@stencil/ssr/next';
import webpack from 'webpack';

type NextWebpackContext = Parameters<NonNullable<NextConfig['webpack']>>[1];

/**
 * Next.js + Stencil SSR. Maps `self` → `globalThis` on the server so any
 * vendored code that expects a browser Worker global does not throw during
 * `next build` / RSC data collection.
 */
export const withFeedlogSSR = (nextConfig: NextConfig & Record<string, unknown>) => {
  const userWebpack = nextConfig.webpack;
  return stencilSSR({
    module: import('@feedlog-ai/react/ssr-components'),
    from: '@feedlog-ai/react',
    hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
    serializeShadowRoot: { default: 'declarative-shadow-dom' },
  })({
    ...nextConfig,
    webpack: (config: Configuration, context: NextWebpackContext) => {
      const nextConfigResult =
        typeof userWebpack === 'function' ? userWebpack(config, context) : config;
      if (context.isServer) {
        nextConfigResult.plugins.push(
          new webpack.DefinePlugin({
            // Bare `self` in Node SSR (e.g. hydrate / DOMPurify paths)
            self: 'globalThis',
          })
        );
      }
      return nextConfigResult;
    },
  });
};
