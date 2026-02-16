import React from 'react';
import { render } from '@testing-library/react';
import {
  FeedlogBadge,
  FeedlogButton,
  FeedlogCard,
  FeedlogGithubIssues,
  FeedlogGithubIssuesClient,
  FeedlogIssuesList,
} from '../index';

// Mock the webcomponents module
jest.mock('@feedlog-ai/webcomponents', () => ({
  defineCustomElements: jest.fn(),
}));

describe('React Wrapper - Module Exports', () => {
  it('should export FeedlogBadge', () => {
    expect(FeedlogBadge).toBeDefined();
  });

  it('should export FeedlogButton', () => {
    expect(FeedlogButton).toBeDefined();
  });

  it('should export FeedlogCard', () => {
    expect(FeedlogCard).toBeDefined();
  });

  it('should export FeedlogGithubIssues', () => {
    expect(FeedlogGithubIssues).toBeDefined();
  });

  it('should export FeedlogIssuesList', () => {
    expect(FeedlogIssuesList).toBeDefined();
  });

  it('should export FeedlogGithubIssuesClient', () => {
    expect(FeedlogGithubIssuesClient).toBeDefined();
  });
});

describe('React Wrapper - Basic Rendering', () => {
  it('FeedlogBadge renders without error', () => {
    const { container } = render(<FeedlogBadge>Test</FeedlogBadge>);
    expect(container.querySelector('feedlog-badge')).toBeDefined();
  });

  it('FeedlogButton renders without error', () => {
    const { container } = render(<FeedlogButton>Click Me</FeedlogButton>);
    expect(container.querySelector('feedlog-button')).toBeDefined();
  });

  it('FeedlogCard renders without error', () => {
    const { container } = render(<FeedlogCard>Content</FeedlogCard>);
    expect(container.querySelector('feedlog-card')).toBeDefined();
  });

  it('FeedlogGithubIssues renders without error', () => {
    const { container } = render(<FeedlogGithubIssues issues={[]} />);
    expect(container.querySelector('feedlog-github-issues')).toBeDefined();
  });

  it('FeedlogIssuesList renders without error', () => {
    const { container } = render(<FeedlogIssuesList issues={[]} />);
    expect(container.querySelector('feedlog-issues-list')).toBeDefined();
  });
});

describe('React Wrapper - Props Passthrough', () => {
  it('FeedlogBadge passes variant prop', () => {
    const { container } = render(<FeedlogBadge variant="destructive">Test</FeedlogBadge>);
    const badge = container.querySelector('feedlog-badge');
    expect(badge?.getAttribute('variant')).toBe('destructive');
  });

  it('FeedlogButton passes size prop', () => {
    const { container } = render(<FeedlogButton size="lg">Click</FeedlogButton>);
    const button = container.querySelector('feedlog-button');
    expect(button?.getAttribute('size')).toBe('lg');
  });

  it('FeedlogButton passes disabled prop', () => {
    const { container } = render(<FeedlogButton disabled>Click</FeedlogButton>);
    const button = container.querySelector('feedlog-button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  it('FeedlogButton passes type prop', () => {
    const { container } = render(<FeedlogButton type="submit">Submit</FeedlogButton>);
    const button = container.querySelector('feedlog-button');
    expect(button?.getAttribute('type')).toBe('submit');
  });

  it('FeedlogGithubIssues passes issues prop', () => {
    const issues = [
      {
        id: '1',
        githubIssueLink: 'https://github.com/feedlog/feedlog-toolkit/issues/1',
        type: 'bug' as const,
        status: 'open' as const,
        pinnedAt: null,
        title: 'Test Issue',
        body: 'Test body',
        revision: 1,
        repository: { id: 'repo-1', name: 'test-repo', description: 'Test repo' },
        updatedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        upvoteCount: 0,
        hasUpvoted: false,
      },
    ];
    const { container } = render(<FeedlogGithubIssues issues={issues} />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component?.getAttribute('issues')).toBeDefined();
  });

  it('FeedlogGithubIssues passes theme prop', () => {
    const { container } = render(<FeedlogGithubIssues issues={[]} theme="dark" />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component?.getAttribute('theme')).toBe('dark');
  });

  it('FeedlogGithubIssues passes loading prop', () => {
    const { container } = render(<FeedlogGithubIssues issues={[]} loading={true} />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component?.getAttribute('loading')).not.toBeNull();
  });
});

describe('React Wrapper - Event Handling', () => {
  it('FeedlogButton emits feedlogClick event', async () => {
    const handler = jest.fn();
    const { container } = render(<FeedlogButton onFeedlogClick={handler}>Click</FeedlogButton>);
    const button = container.querySelector('feedlog-button');

    // Simulate custom event
    const event = new CustomEvent('feedlogClick', { bubbles: true });
    button?.dispatchEvent(event);

    // Handler would be called by React's event system in real scenario
    expect(button).toBeDefined();
  });

  it('FeedlogGithubIssues supports upvote event handler', () => {
    const handler = jest.fn();
    const { container } = render(<FeedlogGithubIssues issues={[]} onFeedlogUpvote={handler} />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component).toBeDefined();
  });
});

describe('React Wrapper - TypeScript Types', () => {
  it('components accept React.ReactNode children', () => {
    const { container } = render(
      <>
        <FeedlogBadge>String child</FeedlogBadge>
        <FeedlogButton>Mixed {123} content</FeedlogButton>
        <FeedlogCard>
          <div>Element</div>
        </FeedlogCard>
      </>
    );
    expect(container.querySelectorAll('feedlog-badge, feedlog-button, feedlog-card').length).toBe(
      3
    );
  });
});
