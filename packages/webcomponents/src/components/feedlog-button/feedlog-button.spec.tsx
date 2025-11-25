import { newSpecPage } from '@stencil/core/testing';
import { FeedlogButton } from './feedlog-button';

describe('feedlog-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: `<feedlog-button>Click me</feedlog-button>`,
    });
    expect(page.root).toBeTruthy();
    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.className).toContain('button');
    expect(button?.className).toContain('button-default');
    expect(button?.className).toContain('button-size-default');
  });

  it('renders with outline variant and sm size', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: `<feedlog-button variant="outline" size="sm">Small</feedlog-button>`,
    });
    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.button-outline')).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.button-size-sm')).toBeTruthy();
  });

  it('emits click event', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: `<feedlog-button>Click</feedlog-button>`,
    });
    expect(page.root).toBeTruthy();
    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button).toBeTruthy();
    const clickSpy = jest.fn();
    page.root?.addEventListener('feedlogClick', clickSpy);
    button?.click();
    await page.waitForChanges();
    expect(clickSpy).toHaveBeenCalled();
  });
});
