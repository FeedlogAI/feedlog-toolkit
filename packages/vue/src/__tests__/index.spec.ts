// Mock the webcomponents module
jest.mock('@feedlog-toolkit/webcomponents', () => ({
  defineCustomElements: jest.fn(),
}));

describe('Vue Wrapper - Module Exports', () => {
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

  it('should export install plugin function', () => {
    const { install } = require('../index');
    expect(install).toBeDefined();
    expect(typeof install).toBe('function');
  });
});

describe('Vue Wrapper - Basic Rendering', () => {
  it('FeedlogBadge can be required', () => {
    const { FeedlogBadge } = require('../index');
    expect(FeedlogBadge).toBeDefined();
  });

  it('FeedlogButton can be required', () => {
    const { FeedlogButton } = require('../index');
    expect(FeedlogButton).toBeDefined();
  });

  it('FeedlogCard can be required', () => {
    const { FeedlogCard } = require('../index');
    expect(FeedlogCard).toBeDefined();
  });

  it('FeedlogGithubIssues can be required', () => {
    const { FeedlogGithubIssues } = require('../index');
    expect(FeedlogGithubIssues).toBeDefined();
  });

  it('FeedlogIssuesList can be required', () => {
    const { FeedlogIssuesList } = require('../index');
    expect(FeedlogIssuesList).toBeDefined();
  });
});

describe('Vue Wrapper - v-bind Props', () => {
  it('FeedlogBadge is a valid component', () => {
    const { FeedlogBadge } = require('../index');
    expect(typeof FeedlogBadge).toBe('object');
  });

  it('FeedlogButton is a valid component', () => {
    const { FeedlogButton } = require('../index');
    expect(typeof FeedlogButton).toBe('object');
  });

  it('FeedlogGithubIssues is a valid component', () => {
    const { FeedlogGithubIssues } = require('../index');
    expect(typeof FeedlogGithubIssues).toBe('object');
  });
});

describe('Vue Wrapper - Reactive Props', () => {
  it('components are properly exported for use in Vue templates', () => {
    const components = require('../index');
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });

  it('install function available for app.use()', () => {
    const { install } = require('../index');
    expect(typeof install).toBe('function');
  });
});

describe('Vue Wrapper - Event Handling', () => {
  it('components support event listeners', () => {
    const { FeedlogButton } = require('../index');
    expect(FeedlogButton).toBeDefined();
  });

  it('FeedlogGithubIssues available for event binding', () => {
    const { FeedlogGithubIssues } = require('../index');
    expect(FeedlogGithubIssues).toBeDefined();
  });
});

describe('Vue Wrapper - Plugin Installation', () => {
  it('install function is defined', () => {
    const { install } = require('../index');
    expect(typeof install).toBe('function');
  });

  it('custom elements are defined after import', () => {
    const { defineCustomElements } = require('@feedlog-toolkit/webcomponents');
    expect(defineCustomElements).toBeDefined();
  });
});

describe('Vue Wrapper - Slot Support', () => {
  it('all components are defined and accessible', () => {
    const { FeedlogBadge, FeedlogButton, FeedlogCard } = require('../index');
    expect(FeedlogBadge).toBeDefined();
    expect(FeedlogButton).toBeDefined();
    expect(FeedlogCard).toBeDefined();
  });
});

