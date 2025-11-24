/**
 * Core utilities for Feedlog Toolkit
 */

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.length > 0;
}

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

