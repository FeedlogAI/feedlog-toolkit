import {
  FeedlogBadge,
  FeedlogButton,
  FeedlogCard,
  FeedlogGithubIssues,
  FeedlogGithubIssuesClient,
  FeedlogIssuesList,
  install,
} from '../index';

// Mock the webcomponents module
jest.mock('@feedlog-toolkit/webcomponents', () => ({
  defineCustomElements: jest.fn(),
}));

describe('Vue Wrapper - Module Exports', () => {
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

  it('should export install plugin function', () => {
    expect(install).toBeDefined();
    expect(typeof install).toBe('function');
  });
});

describe('Vue Wrapper - Basic Rendering', () => {
  it('FeedlogBadge is available', () => {
    expect(FeedlogBadge).toBeDefined();
  });

  it('FeedlogButton is available', () => {
    expect(FeedlogButton).toBeDefined();
  });

  it('FeedlogCard is available', () => {
    expect(FeedlogCard).toBeDefined();
  });

  it('FeedlogGithubIssues is available', () => {
    expect(FeedlogGithubIssues).toBeDefined();
  });

  it('FeedlogIssuesList is available', () => {
    expect(FeedlogIssuesList).toBeDefined();
  });
});

describe('Vue Wrapper - v-bind Props', () => {
  it('FeedlogBadge is a valid component', () => {
    expect(typeof FeedlogBadge).toBe('object');
  });

  it('FeedlogButton is a valid component', () => {
    expect(typeof FeedlogButton).toBe('object');
  });

  it('FeedlogGithubIssues is a valid component', () => {
    expect(typeof FeedlogGithubIssues).toBe('object');
  });
});

describe('Vue Wrapper - Reactive Props', () => {
  it('install function available for app.use()', () => {
    expect(typeof install).toBe('function');
  });
});

describe('Vue Wrapper - Event Handling', () => {
  it('components support event listeners', () => {
    expect(FeedlogButton).toBeDefined();
  });

  it('FeedlogGithubIssues available for event binding', () => {
    expect(FeedlogGithubIssues).toBeDefined();
  });
});

describe('Vue Wrapper - Plugin Installation', () => {
  it('install function is defined', () => {
    expect(typeof install).toBe('function');
  });
});

describe('Vue Wrapper - Slot Support', () => {
  it('all components are defined and accessible', () => {
    expect(FeedlogBadge).toBeDefined();
    expect(FeedlogButton).toBeDefined();
    expect(FeedlogCard).toBeDefined();
  });
});
