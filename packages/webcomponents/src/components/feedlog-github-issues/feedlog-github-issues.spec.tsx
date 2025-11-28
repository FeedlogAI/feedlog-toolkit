import { newSpecPage } from '@stencil/core/testing';
import { FeedlogGithubIssues } from './feedlog-github-issues';
import { FeedlogIssuesList } from '../feedlog-issues-list/feedlog-issues-list';
import { FeedlogCard } from '../feedlog-card/feedlog-card';
import { FeedlogBadge } from '../feedlog-badge/feedlog-badge';
import { FeedlogButton } from '../feedlog-button/feedlog-button';

describe('feedlog-github-issues', () => {
  const mockIssues = [
    {
      id: 1,
      title: 'Test Bug',
      body: 'This is a test bug',
      type: 'bug' as const,
    },
    {
      id: 2,
      title: 'Test Enhancement',
      body: 'This is a test enhancement',
      type: 'enhancement' as const,
      upvotes: 5,
    },
  ];

  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
      html: `<feedlog-github-issues></feedlog-github-issues>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders issues list when not loading and no error', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.issues = mockIssues;
      page.root.loading = false;
      page.root.error = null;
      await page.waitForChanges();
      expect(page.root.shadowRoot?.querySelector('feedlog-issues-list')).toBeTruthy();
    }
  });

  it('shows loading state', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.loading = true;
      await page.waitForChanges();
      expect(page.root.shadowRoot?.querySelector('.loading-state')).toBeTruthy();
      expect(page.root.shadowRoot?.querySelector('.loading-state')?.textContent).toContain('Loading issues...');
    }
  });

  it('shows error state', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.error = 'Failed to fetch issues';
      page.root.loading = false;
      await page.waitForChanges();
      expect(page.root.shadowRoot?.querySelector('.error-state')).toBeTruthy();
      expect(page.root.shadowRoot?.querySelector('.error-state')?.textContent).toContain('Failed to fetch issues');
    }
  });

  it('emits upvote event', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.issues = mockIssues;
      page.root.loading = false;
      page.root.error = null;
      await page.waitForChanges();

      const upvoteSpy = jest.fn();
      page.doc.addEventListener('feedlogUpvote', upvoteSpy);

      const issuesList = page.root.shadowRoot?.querySelector('feedlog-issues-list');
      if (issuesList) {
        const upvoteButton = issuesList.shadowRoot?.querySelector('feedlog-button');
        if (upvoteButton) {
          const buttonElement = upvoteButton.shadowRoot?.querySelector('button');
          if (buttonElement) {
            buttonElement.click();
            await page.waitForChanges();
            expect(upvoteSpy).toHaveBeenCalled();
          }
        }
      }
    }
  });

  it('applies dark theme class', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.theme = 'dark';
      await page.waitForChanges();
      expect(page.root.classList.contains('dark')).toBe(true);
    }
  });

  it('applies maxWidth style', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.maxWidth = '32rem';
      await page.waitForChanges();
      const container = page.root.shadowRoot?.querySelector('.github-issues-container');
      expect(container).toBeTruthy();
      expect(container?.getAttribute('style')).toContain('max-width: 32rem');
    }
  });
});
