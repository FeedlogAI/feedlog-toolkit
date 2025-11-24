import { newSpecPage } from '@stencil/core/testing';
import { FeedlogChart } from './feedlog-chart';

describe('feedlog-chart', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedlogChart],
      html: `<feedlog-chart></feedlog-chart>`,
    });
    expect(page.root).toEqualHtml(`
      <feedlog-chart>
        <mock:shadow-root>
          <div class="feedlog-chart-container">
            <div class="chart-content">
              <div class="no-data">No data available</div>
            </div>
          </div>
        </mock:shadow-root>
      </feedlog-chart>
    `);
  });

  it('renders with title', async () => {
    const page = await newSpecPage({
      components: [FeedlogChart],
      html: `<feedlog-chart title="Test Chart"></feedlog-chart>`,
    });
    expect(page.root.querySelector('.chart-title')).toEqualHtml(`<h3 class="chart-title">Test Chart</h3>`);
  });

  it('renders with data', async () => {
    const testData = JSON.stringify([{ x: 1, y: 2 }, { x: 2, y: 3 }]);
    const page = await newSpecPage({
      components: [FeedlogChart],
      html: `<feedlog-chart data='${testData}'></feedlog-chart>`,
    });
    expect(page.root.querySelector('.chart')).toBeTruthy();
  });
});

