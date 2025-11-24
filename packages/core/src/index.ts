/**
 * Core SDK for Feedlog Toolkit
 * 
 * This package provides the core functionality and utilities
 * used across all Feedlog Toolkit packages.
 */

// Export types
export * from './types';

// Export utilities
export * from './utils';

// Export main SDK class (example structure)
export class FeedlogSDK {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Initialize the SDK with configuration
   */
  initialize(config: { apiKey: string }): void {
    this.apiKey = config.apiKey;
  }

  /**
   * Get the current API key
   */
  getApiKey(): string | undefined {
    return this.apiKey;
  }
}

