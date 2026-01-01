import { newSpecPage } from '@stencil/core/testing';
import { FeedlogIssuesList } from './feedlog-issues-list';
import { FeedlogBadge } from '../feedlog-badge/feedlog-badge';

describe('feedlog-issues-list', () => {
  const mockIssues = [
    {
      id: 'issue-1',
      githubIssueNumber: 1,
      title: 'Test Bug',
      body: 'This is a test bug',
      type: 'bug' as const,
      status: 'open' as const,
      pinnedAt: null,
      revision: 1,
      repository: {
        id: 'repo-1',
        name: 'test-repo',
        owner: 'test-owner',
      },
      updatedAt: '2024-01-02T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      upvoteCount: 5,
      hasUpvoted: false,
    },
    {
      id: 'issue-2',
      githubIssueNumber: 2,
      title: 'Test Enhancement',
      body: 'This is a test enhancement',
      type: 'enhancement' as const,
      status: 'open' as const,
      pinnedAt: '2024-01-03T00:00:00Z',
      revision: 1,
      repository: {
        id: 'repo-1',
        name: 'test-repo',
        owner: 'test-owner',
      },
      updatedAt: '2024-01-02T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      upvoteCount: 10,
      hasUpvoted: true,
    },
  ];

  describe('Rendering', () => {
    it('renders', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });
      expect(page.root).toBeTruthy();
    });

    it('should render empty state when no issues', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      expect(page.root).toBeTruthy();
      if (page.root) {
        expect(page.root.shadowRoot?.querySelector('.empty-state')).toBeTruthy();
        expect(page.root.shadowRoot?.textContent).toContain('No issues found');
      }
    });

    it('should render issues list', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      expect(page.root).toBeTruthy();
      if (page.root) {
        page.root.issues = mockIssues;
        await page.waitForChanges();

        const cards = page.root.shadowRoot?.querySelectorAll('.issue-card');
        expect(cards?.length).toBe(2);
      }
    });
  });

  describe('Issue display', () => {
    it('should display issue title', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain('Test Bug');
      }
    });

    it('should display issue body', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain('This is a test bug');
      }
    });

    it('should display repository information', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        const shadowText = page.root.shadowRoot?.textContent;
        expect(shadowText).toContain('test-owner');
        expect(shadowText).toContain('test-repo');
      }
    });

    it('should display GitHub issue number', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain('#1');
      }
    });

    it('should show pinned indicator for pinned issues', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[1]]; // Pinned issue
        await page.waitForChanges();

        const pinnedIndicator = page.root.shadowRoot?.querySelector('.pinned-indicator');
        expect(pinnedIndicator).toBeTruthy();
      }
    });
  });

  describe('Issue types', () => {
    it('should display bug type badge', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain('Bug');
      }
    });

    it('should display enhancement type badge', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[1]];
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain('Enhancement');
      }
    });
  });

  describe('Upvoting', () => {
    it('should render upvote button for all issues', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = mockIssues;
        await page.waitForChanges();

        const buttons = page.root.shadowRoot?.querySelectorAll('.upvote-button');
        expect(buttons?.length).toBe(2);
      }
    });

    it('should display upvote count', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain('5');
      }
    });

    it('should show upvoted state when hasUpvoted is true', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[1]]; // hasUpvoted: true
        await page.waitForChanges();

        const button = page.root.shadowRoot?.querySelector('.upvote-button');
        expect(button?.classList.contains('upvoted')).toBe(true);
      }
    });

    it('should emit upvote event when button is clicked', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        const upvoteSpy = jest.fn();
        page.doc.addEventListener('feedlogUpvote', upvoteSpy);

        const button = page.root.shadowRoot?.querySelector('.upvote-button') as HTMLButtonElement;
        if (button) {
          button.click();
          await page.waitForChanges();

          expect(upvoteSpy).toHaveBeenCalled();
          const event = upvoteSpy.mock.calls[0][0];
          expect(event.detail.issueId).toBe('issue-1');
          expect(event.detail.currentUpvoted).toBe(false);
          expect(event.detail.currentCount).toBe(5);
        }
      }
    });

    it('should pass correct data in upvote event', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[1]]; // hasUpvoted: true, upvoteCount: 10
        await page.waitForChanges();

        const upvoteSpy = jest.fn();
        page.doc.addEventListener('feedlogUpvote', upvoteSpy);

        const button = page.root.shadowRoot?.querySelector('.upvote-button') as HTMLButtonElement;
        if (button) {
          button.click();
          await page.waitForChanges();

          const event = upvoteSpy.mock.calls[0][0];
          expect(event.detail.currentUpvoted).toBe(true);
          expect(event.detail.currentCount).toBe(10);
        }
      }
    });
  });

  describe('Theming', () => {
    it('should apply light theme by default', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        expect(page.root.theme).toBe('light');
        expect(page.root.classList.contains('dark')).toBe(false);
      }
    });

    it('should apply dark theme when specified', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list theme="dark"></feedlog-issues-list>`,
      });

      if (page.root) {
        expect(page.root.theme).toBe('dark');
        expect(page.root.classList.contains('dark')).toBe(true);
      }
    });
  });

  describe('Date formatting', () => {
    it('should display formatted dates', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        page.root.issues = [mockIssues[0]];
        await page.waitForChanges();

        // Should contain some relative time format
        const text = page.root.shadowRoot?.textContent;
        expect(text).toMatch(/ago|unknown date/);
      }
    });
  });

  describe('XSS Prevention', () => {
    it('should not render malicious HTML in title', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        const maliciousIssue = {
          ...mockIssues[0],
          title: '<script>alert("xss")</script>Malicious',
        };
        page.root.issues = [maliciousIssue];
        await page.waitForChanges();

        const text = page.root.shadowRoot?.textContent;
        expect(text).not.toContain('alert');
      }
    });

    it('should not render malicious HTML in body', async () => {
      const page = await newSpecPage({
        components: [FeedlogIssuesList, FeedlogBadge],
        html: `<feedlog-issues-list></feedlog-issues-list>`,
      });

      if (page.root) {
        const maliciousIssue = {
          ...mockIssues[0],
          body: '<img src=x onerror="alert(\'xss\')">Malicious',
        };
        page.root.issues = [maliciousIssue];
        await page.waitForChanges();

        const text = page.root.shadowRoot?.textContent;
        expect(text).not.toContain('onerror');
      }
    });
  });
});

