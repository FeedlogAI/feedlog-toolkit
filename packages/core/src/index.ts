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

export interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  type: 'bug' | 'enhancement';
  upvotes?: number;
}

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

  /**
   * Fetch issues for the given repositories
   * This is a mock implementation that returns sample data
   */
  async fetchIssues(repos: string[]): Promise<GitHubIssue[]> {
    // Mock implementation - returns sample issues
    // In a real implementation, this would make an API call
    const mockIssues: GitHubIssue[] = [
      {
        id: 1,
        title: 'Sample Bug Issue',
        body: 'This is a sample bug issue description.',
        type: 'bug',
      },
      {
        id: 2,
        title: 'Sample Enhancement Request',
        body: 'This is a sample enhancement request description.',
        type: 'enhancement',
        upvotes: 5,
      },
      {
        id: 3,
        title: 'Another Bug',
        body: 'Another sample bug issue.',
        type: 'bug',
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockIssues;
  }
}

