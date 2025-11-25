import { newSpecPage } from '@stencil/core/testing';
import { FeedlogCard } from './feedlog-card';

describe('feedlog-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedlogCard],
      html: `<feedlog-card></feedlog-card>`,
    });
    expect(page.root).toEqualHtml(`
      <feedlog-card>
        <mock:shadow-root>
          <div class="feedlog-card">
            <slot name="header"></slot>
            <slot name="content"></slot>
            <slot name="footer"></slot>
          </div>
        </mock:shadow-root>
      </feedlog-card>
    `);
  });
});

