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
  postedAt?: string;
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
        title: 'Tooltip flickers when cursor moves between nested hover targets',
        body: 'Tooltips display inconsistently when hovering over elements with nested children. The tooltip rapidly appears and disappears causing a flicker effect in Chrome 120+.',
        type: 'bug',
        postedAt: '2 hours ago',
      },
      {
        id: 2,
        title: 'Add support for LaTeX math equations in markdown editor',
        body: 'Enable inline and block LaTeX rendering using KaTeX or MathJax for scientific documentation. Should support $inline$ and $$block$$ syntax.',
        type: 'enhancement',
        upvotes: 42,
        postedAt: '5 hours ago',
      },
      {
        id: 3,
        title: 'WebGL context lost error after prolonged canvas usage',
        body: 'After approximately 2 hours of continuous 3D visualization rendering, the WebGL context is lost and not properly recovered. Happens consistently on discrete GPUs.',
        type: 'bug',
        postedAt: '1 day ago',
      },
      {
        id: 4,
        title: 'Implement vim keybindings mode for code editor',
        body: 'Add optional vim keybindings (normal, insert, visual modes) for the Monaco code editor component. Should include custom keybinding configuration.',
        type: 'enhancement',
        upvotes: 127,
        postedAt: '2 days ago',
      },
      {
        id: 5,
        title: 'Race condition in WebSocket reconnection logic',
        body: 'When network connection drops and recovers quickly, multiple reconnection attempts fire simultaneously leading to duplicate message subscriptions.',
        type: 'bug',
        postedAt: '3 days ago',
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockIssues;
  }
}

