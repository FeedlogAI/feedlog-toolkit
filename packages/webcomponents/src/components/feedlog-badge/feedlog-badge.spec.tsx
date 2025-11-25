import { newSpecPage } from '@stencil/core/testing';
import { FeedlogBadge } from './feedlog-badge';

describe('feedlog-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: `<feedlog-badge>Test</feedlog-badge>`,
    });
    expect(page.root).toEqualHtml(`
      <feedlog-badge>
        <mock:shadow-root>
          <span class="badge badge-default">Test</span>
        </mock:shadow-root>
      </feedlog-badge>
    `);
  });

  it('renders with destructive variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: `<feedlog-badge variant="destructive">Bug</feedlog-badge>`,
    });
    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.badge-destructive')).toBeTruthy();
  });
});
