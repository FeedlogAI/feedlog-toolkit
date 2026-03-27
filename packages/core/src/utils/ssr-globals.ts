/**
 * Libraries such as isomorphic-dompurify's browser shim reference `self` at load time.
 * Node (SSR, Vite dev server) does not define `self`; align with `globalThis` before those modules run.
 */
if (
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as { self?: unknown }).self === 'undefined'
) {
  (globalThis as { self: typeof globalThis }).self = globalThis;
}
