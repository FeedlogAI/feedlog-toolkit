/**
 * TanStack Start SSR configuration
 *
 * TanStack Start is Vite-based. Use the same feedlogSSR plugin from the vite export.
 * Add it to your vite.config.ts after the React plugin:
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { tanstackStart } from '@tanstack/react-start/plugin/vite';
 * import viteReact from '@vitejs/plugin-react';
 * import { feedlogSSR } from '@feedlog-ai/react/start';
 *
 * export default defineConfig({
 *   plugins: [
 *     tanstackStart(),
 *     viteReact(),
 *     feedlogSSR(),
 *   ],
 * });
 * ```
 */
export { feedlogSSR } from './vite';
