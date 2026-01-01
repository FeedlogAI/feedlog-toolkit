import { newSpecPage } from '@stencil/core/testing';
import { FeedlogButton } from '../../components/feedlog-button/feedlog-button';

describe('feedlog-button - Props', () => {
  it('should render default variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button>Click Me</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-default');
  });

  it('should render outline variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button variant="outline">Click</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-outline');
  });

  it('should render ghost variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button variant="ghost">Click</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-ghost');
  });

  it('should render destructive variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button variant="destructive">Delete</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-destructive');
  });

  it('should render default size', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button size="default">Click</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-size-default');
  });

  it('should render small size', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button size="sm">Small</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-size-sm');
  });

  it('should render large size', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button size="lg">Large</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveClass('button-size-lg');
  });

  it('should render button type', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button type="button">Click</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveAttribute('type', 'button');
  });

  it('should render submit type', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button type="submit">Submit</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveAttribute('type', 'submit');
  });

  it('should render reset type', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button type="reset">Reset</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveAttribute('type', 'reset');
  });

  it('should render enabled state', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button disabled="false">Click</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).not.toHaveAttribute('disabled');
  });

  it('should render disabled state', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button disabled="true">Disabled</feedlog-button>',
    });

    expect(page.root?.shadowRoot?.querySelector('button')).toHaveAttribute('disabled');
  });

  it('should combine variant and size classes', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button variant="outline" size="lg">Large Outline</feedlog-button>',
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('button-outline')).toBe(true);
    expect(button?.classList.contains('button-size-lg')).toBe(true);
  });
});

describe('feedlog-button - Events', () => {
  it('should emit feedlogClick event on click when enabled', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button disabled="false">Click</feedlog-button>',
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('feedlogClick', clickSpy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not emit event when disabled', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button disabled="true">Disabled</feedlog-button>',
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('feedlogClick', clickSpy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should emit event for multiple clicks', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button>Click</feedlog-button>',
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('feedlogClick', clickSpy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();
    button.click();
    button.click();

    expect(clickSpy).toHaveBeenCalledTimes(3);
  });
});

describe('feedlog-button - State Management', () => {
  it('should render with disabled attribute', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button disabled="true">Disabled</feedlog-button>',
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button).toHaveAttribute('disabled');
  });

  it('should render without disabled when not specified', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button>Click</feedlog-button>',
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button).not.toHaveAttribute('disabled');
  });

  it('should have button and variant classes', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button variant="outline">Click</feedlog-button>',
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('button')).toBe(true);
    expect(button?.classList.contains('button-outline')).toBe(true);
  });
});

describe('feedlog-button - Slot Content', () => {
  it('should have slot for content', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button>Click Me</feedlog-button>',
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('should have slot with icon', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button><svg></svg> Label</feedlog-button>',
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('should support multiple child elements', async () => {
    const page = await newSpecPage({
      components: [FeedlogButton],
      html: '<feedlog-button><span>Part</span><span>One</span></feedlog-button>',
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });
});

