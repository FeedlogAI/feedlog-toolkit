/**
 * SSR-safe components only.
 * Use this entry point for @stencil/ssr to avoid serializing dynamic props
 * (e.g. apiKey) as their identifier names. Components with complex/runtime
 * props (FeedlogIssuesClient, FeedlogIssueComponent, etc.) are excluded.
 *
 * Exports hook-free `React.createElement` wrappers from `./server` — not from `./index`,
 * which uses `useEffect` / `useRef` and must only load in Client Components.
 */
export { FeedlogBadge, FeedlogButton, FeedlogCard } from './server.js';
export type { FeedlogIssue } from './server.js';
