/**
 * HTML and XSS sanitization utilities
 */

import './ssr-globals';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Basic HTML entity escaping to prevent XSS
 * This is a lightweight alternative when you need plain text only
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') {
    return '';
  }

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize HTML using DOMPurify (safe for untrusted content).
 * Removes scripts, dangerous URLs, and unsafe attributes.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}

/**
 * Validate that a string is safe to display as HTML
 * Returns true if string contains potentially dangerous content
 */
export function containsDangerousContent(html: string): boolean {
  if (typeof html !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /javascript:/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(html));
}

/**
 * Strip HTML tags completely, leaving only text content
 */
export function stripHtmlTags(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + '...';
}
