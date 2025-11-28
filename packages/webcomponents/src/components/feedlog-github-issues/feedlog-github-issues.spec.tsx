import { newSpecPage } from '@stencil/core/testing';
import { FeedlogGithubIssues } from './feedlog-github-issues';
import { FeedlogGithubIssuesBase } from '../feedlog-github-issues-base/feedlog-github-issues-base';
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
      components: [FeedlogGithubIssues, FeedlogGithubIssuesBase, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
      html: `<feedlog-github-issues></feedlog-github-issues>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders with data prop as array', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogGithubIssuesBase, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.data = mockIssues;
      await page.waitForChanges();
      const baseComponent = page.root.shadowRoot?.querySelector('feedlog-github-issues-base');
      expect(baseComponent).toBeTruthy();
    }
  });

  it('parses JSON string data', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogGithubIssuesBase, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.data = JSON.stringify(mockIssues);
      await page.waitForChanges();
      const baseComponent = page.root.shadowRoot?.querySelector('feedlog-github-issues-base');
      expect(baseComponent).toBeTruthy();
    }
  });

  it('emits upvote event', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogGithubIssuesBase, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.data = mockIssues;
      await page.waitForChanges();

      const upvoteSpy = jest.fn();
      page.doc.addEventListener('feedlogUpvote', upvoteSpy);

      const baseComponent = page.root.shadowRoot?.querySelector('feedlog-github-issues-base');
      if (baseComponent) {
        const issuesList = baseComponent.shadowRoot?.querySelector('feedlog-issues-list');
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
    }
  });

  it('renders bug icon for bug issues', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogGithubIssuesBase, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.data = [mockIssues[0]];
      await page.waitForChanges();
      const baseComponent = page.root.shadowRoot?.querySelector('feedlog-github-issues-base');
      const issuesList = baseComponent?.shadowRoot?.querySelector('feedlog-issues-list');
      expect(issuesList?.shadowRoot?.querySelector('.bug-icon')).toBeTruthy();
    }
  });

  it('renders upvote button for enhancement issues', async () => {
    const page = await newSpecPage({
      components: [FeedlogGithubIssues, FeedlogGithubIssuesBase, FeedlogIssuesList, FeedlogCard, FeedlogBadge, FeedlogButton],
    });
    expect(page.root).toBeTruthy();
    if (page.root) {
      page.root.data = [mockIssues[1]];
      await page.waitForChanges();
      const baseComponent = page.root.shadowRoot?.querySelector('feedlog-github-issues-base');
      const issuesList = baseComponent?.shadowRoot?.querySelector('feedlog-issues-list');
      expect(issuesList?.shadowRoot?.querySelector('feedlog-button')).toBeTruthy();
    }
  });
});
