import { newSpecPage } from '@stencil/core/testing';
import { FeedlogIssuesClient } from './feedlog-issues-client';

describe('feedlog-issues-client - --feedlog-background forwarding', () => {
  it('should forward --feedlog-background from host to feedlog-issues child', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      html: '<feedlog-issues-client api-key="test-key" style="--feedlog-background: transparent"></feedlog-issues-client>',
    });

    await page.waitForChanges();

    const feedlogIssues = page.root?.shadowRoot?.querySelector('feedlog-issues');
    expect(feedlogIssues).toBeDefined();

    const bgValue = feedlogIssues?.style?.getPropertyValue('--feedlog-background');
    expect(bgValue).toBe('transparent');
  });

  it('should not pass style to feedlog-issues when host has no --feedlog-background', async () => {
    const page = await newSpecPage({
      components: [FeedlogIssuesClient],
      html: '<feedlog-issues-client api-key="test-key"></feedlog-issues-client>',
    });

    await page.waitForChanges();

    const feedlogIssues = page.root?.shadowRoot?.querySelector('feedlog-issues');
    expect(feedlogIssues).toBeDefined();

    const bgValue = feedlogIssues?.style?.getPropertyValue('--feedlog-background');
    expect(bgValue).toBe('');
  });
});
