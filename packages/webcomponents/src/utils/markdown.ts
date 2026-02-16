import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Parse markdown to sanitized HTML for safe rendering.
 * Uses marked for parsing and DOMPurify for XSS protection.
 */
export function parseMarkdown(markdown: string | null | undefined): string {
  if (markdown == null || markdown === '') {
    return '';
  }

  const html = marked.parse(markdown, {
    gfm: true,
    breaks: true,
  }) as string;

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
