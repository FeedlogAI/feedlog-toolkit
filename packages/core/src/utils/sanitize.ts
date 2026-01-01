/**
 * HTML and XSS sanitization utilities
 */

/**
 * Basic HTML entity escaping to prevent XSS
 * This is a lightweight alternative to DOMPurify
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
 * Sanitize HTML by removing dangerous tags and attributes
 * Removes script tags, event handlers, and other potentially malicious content
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Remove script tags and content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove style tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove embed and object tags
  sanitized = sanitized.replace(/<(embed|object)\b[^<]*>/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol for potentially dangerous mime types
  sanitized = sanitized.replace(/data:(?!image\/(?:png|jpg|jpeg|gif|webp);)/gi, '');

  return sanitized;
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

