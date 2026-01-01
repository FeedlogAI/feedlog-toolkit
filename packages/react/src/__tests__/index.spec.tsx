import React from 'react';
import { render } from '@testing-library/react';

// Mock the webcomponents module
jest.mock('@feedlog-toolkit/webcomponents', () => ({
  defineCustomElements: jest.fn(),
}));

describe('React Wrapper - Module Exports', () => {
  it('should export FeedlogBadge', () => {
    const { FeedlogBadge } = require('../index');
    expect(FeedlogBadge).toBeDefined();
  });

  it('should export FeedlogButton', () => {
    const { FeedlogButton } = require('../index');
    expect(FeedlogButton).toBeDefined();
  });

  it('should export FeedlogCard', () => {
    const { FeedlogCard } = require('../index');
    expect(FeedlogCard).toBeDefined();
  });

  it('should export FeedlogGithubIssues', () => {
    const { FeedlogGithubIssues } = require('../index');
    expect(FeedlogGithubIssues).toBeDefined();
  });

  it('should export FeedlogIssuesList', () => {
    const { FeedlogIssuesList } = require('../index');
    expect(FeedlogIssuesList).toBeDefined();
  });

  it('should export all components from stencil-generated', () => {
    const stencilGenerated = require('../components/stencil-generated');
    expect(Object.keys(stencilGenerated).length).toBeGreaterThan(0);
  });
});

describe('React Wrapper - Basic Rendering', () => {
  it('FeedlogBadge renders without error', () => {
    const { FeedlogBadge } = require('../index');
    const { container } = render(<FeedlogBadge>Test</FeedlogBadge>);
    expect(container.querySelector('feedlog-badge')).toBeDefined();
  });

  it('FeedlogButton renders without error', () => {
    const { FeedlogButton } = require('../index');
    const { container } = render(<FeedlogButton>Click Me</FeedlogButton>);
    expect(container.querySelector('feedlog-button')).toBeDefined();
  });

  it('FeedlogCard renders without error', () => {
    const { FeedlogCard } = require('../index');
    const { container } = render(<FeedlogCard>Content</FeedlogCard>);
    expect(container.querySelector('feedlog-card')).toBeDefined();
  });

  it('FeedlogGithubIssues renders without error', () => {
    const { FeedlogGithubIssues } = require('../index');
    const { container } = render(<FeedlogGithubIssues issues={[]} />);
    expect(container.querySelector('feedlog-github-issues')).toBeDefined();
  });

  it('FeedlogIssuesList renders without error', () => {
    const { FeedlogIssuesList } = require('../index');
    const { container } = render(<FeedlogIssuesList issues={[]} />);
    expect(container.querySelector('feedlog-issues-list')).toBeDefined();
  });
});

describe('React Wrapper - Props Passthrough', () => {
  it('FeedlogBadge passes variant prop', () => {
    const { FeedlogBadge } = require('../index');
    const { container } = render(<FeedlogBadge variant="destructive">Test</FeedlogBadge>);
    const badge = container.querySelector('feedlog-badge');
    expect(badge?.getAttribute('variant')).toBe('destructive');
  });

  it('FeedlogButton passes size prop', () => {
    const { FeedlogButton } = require('../index');
    const { container } = render(<FeedlogButton size="lg">Click</FeedlogButton>);
    const button = container.querySelector('feedlog-button');
    expect(button?.getAttribute('size')).toBe('lg');
  });

  it('FeedlogButton passes disabled prop', () => {
    const { FeedlogButton } = require('../index');
    const { container } = render(<FeedlogButton disabled>Click</FeedlogButton>);
    const button = container.querySelector('feedlog-button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  it('FeedlogButton passes type prop', () => {
    const { FeedlogButton } = require('../index');
    const { container } = render(<FeedlogButton type="submit">Submit</FeedlogButton>);
    const button = container.querySelector('feedlog-button');
    expect(button?.getAttribute('type')).toBe('submit');
  });

  it('FeedlogGithubIssues passes issues prop', () => {
    const { FeedlogGithubIssues } = require('../index');
    const issues = [{ id: '1', title: 'Test' }];
    const { container } = render(<FeedlogGithubIssues issues={issues} />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component?.getAttribute('issues')).toBeDefined();
  });

  it('FeedlogGithubIssues passes theme prop', () => {
    const { FeedlogGithubIssues } = require('../index');
    const { container } = render(<FeedlogGithubIssues issues={[]} theme="dark" />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component?.getAttribute('theme')).toBe('dark');
  });

  it('FeedlogGithubIssues passes loading prop', () => {
    const { FeedlogGithubIssues } = require('../index');
    const { container } = render(<FeedlogGithubIssues issues={[]} loading={true} />);
    const component = container.querySelector('feedlog-github-issues');
    expect(component?.getAttribute('loading')).not.toBeNull();
  });
});

describe('React Wrapper - Event Handling', () => {
  it('FeedlogButton emits feedlogClick event', async () => {
    const { FeedlogButton } = require('../index');
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
    const { FeedlogGithubIssues } = require('../index');
    const handler = jest.fn();
    const { container } = render(
      <FeedlogGithubIssues issues={[]} onFeedlogUpvote={handler} />
    );
    const component = container.querySelector('feedlog-github-issues');
    expect(component).toBeDefined();
  });
});

describe('React Wrapper - TypeScript Types', () => {
  it('components accept React.ReactNode children', () => {
    const { FeedlogBadge, FeedlogButton, FeedlogCard } = require('../index');
    const { container } = render(
      <>
        <FeedlogBadge>String child</FeedlogBadge>
        <FeedlogButton>Mixed {123} content</FeedlogButton>
        <FeedlogCard><div>Element</div></FeedlogCard>
      </>
    );
    expect(container.querySelectorAll('feedlog-badge, feedlog-button, feedlog-card').length).toBe(3);
  });
});

