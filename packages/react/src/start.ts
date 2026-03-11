import { stencilSSR } from '@stencil/ssr';

export const feedlogSSR = () =>
  stencilSSR({
    module: import('@feedlog-ai/react/ssr-components'),
    from: '@feedlog-ai/react',
    hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
    serializeShadowRoot: { default: 'declarative-shadow-dom' },
  });
