/**
 * Core utilities for Feedlog Toolkit
 */

// Re-export sanitization utilities
export {
  escapeHtml,
  sanitizeHtml,
  containsDangerousContent,
  stripHtmlTags,
  truncateText,
} from './sanitize';

/**
 * Create a timestamp
 */
export function createTimestamp(): number {
  return Date.now();
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get cookie value by name
 * Used for reading the anonymous user ID cookie set by the server
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(nameEQ)) {
      return trimmed.substring(nameEQ.length);
    }
  }

  return null;
}

/**
 * Create a rate limiter function
 * Returns a function that can be called to check if an action should be rate limited
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const timestamps: number[] = [];

  return {
    /**
     * Check if an action is allowed based on rate limit
     */
    isAllowed(): boolean {
      const now = Date.now();
      const windowStart = now - windowMs;

      // Remove timestamps outside the window
      while (timestamps.length > 0 && timestamps[0] < windowStart) {
        timestamps.shift();
      }

      if (timestamps.length < maxRequests) {
        timestamps.push(now);
        return true;
      }

      return false;
    },

    /**
     * Reset the rate limiter
     */
    reset(): void {
      timestamps.length = 0;
    },

    /**
     * Get remaining requests in current window
     */
    getRemaining(): number {
      const now = Date.now();
      const windowStart = now - windowMs;

      const validTimestamps = timestamps.filter(ts => ts >= windowStart);
      return Math.max(0, maxRequests - validTimestamps.length);
    },
  };
}
