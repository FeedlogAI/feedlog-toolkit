import '@feedlog-ai/core/ssr-globals';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

let noopenerHookRegistered = false;

function ensureNoopenerHook(): void {
  if (noopenerHookRegistered) {
    return;
  }
  noopenerHookRegistered = true;
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.nodeName !== 'A') {
      return;
    }
    const target = node.getAttribute?.('target');
    if (target !== '_blank') {
      return;
    }
    const rel = node.getAttribute?.('rel') ?? '';
    if (/\bnoopener\b/i.test(rel)) {
      return;
    }
    node.setAttribute?.('rel', rel ? `${rel} noopener noreferrer`.trim() : 'noopener noreferrer');
  });
}

/**
 * Parse markdown to sanitized HTML for safe rendering.
 * Uses marked for parsing and DOMPurify for XSS protection.
 */
export function parseMarkdown(markdown: string | null | undefined): string {
  if (markdown == null || markdown === '') {
    return '';
  }

  const parsed = marked.parse(markdown, {
    gfm: true,
    breaks: true,
    async: false,
  });
  if (typeof parsed !== 'string') {
    throw new Error('marked.parse returned a Promise; async markdown is not supported');
  }
  const html = parsed;

  ensureNoopenerHook();

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'b',
      'i',
      'u',
      's',
      'code',
      'pre',
      'a',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
