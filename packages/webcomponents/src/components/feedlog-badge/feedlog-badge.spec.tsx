import { newSpecPage } from '@stencil/core/testing';
import { FeedlogBadge } from '../../components/feedlog-badge/feedlog-badge';

describe('feedlog-badge - Rendering', () => {
  it('should render default variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge>Bug</feedlog-badge>',
    });

    expect(page.root).toEqualHtml(`
      <feedlog-badge>
        <mock:shadow-root>
          <span class="badge badge-default">
            <slot></slot>
          </span>
        </mock:shadow-root>
        Bug
      </feedlog-badge>
    `);
  });

  it('should render destructive variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge variant="destructive">Critical</feedlog-badge>',
    });

    expect(page.root?.shadowRoot?.querySelector('span')).toHaveClass('badge-destructive');
  });

  it('should render enhancement variant', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge variant="enhancement">Feature</feedlog-badge>',
    });

    expect(page.root?.shadowRoot?.querySelector('span')).toHaveClass('badge-enhancement');
  });

  it('should render with slot content', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge>Custom Badge</feedlog-badge>',
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('should apply correct classes', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge variant="destructive"></feedlog-badge>',
    });

    const span = page.root?.shadowRoot?.querySelector('span');
    expect(span?.classList.contains('badge')).toBe(true);
    expect(span?.classList.contains('badge-destructive')).toBe(true);
  });

  it('should render enhancement variant with correct classes', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge variant="enhancement"></feedlog-badge>',
    });

    const span = page.root?.shadowRoot?.querySelector('span');
    expect(span?.classList.contains('badge')).toBe(true);
    expect(span?.classList.contains('badge-enhancement')).toBe(true);
  });
});

describe('feedlog-badge - CSS Classes', () => {
  it('should have shadow DOM isolation', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge></feedlog-badge>',
    });

    expect(page.root?.shadowRoot).toBeDefined();
  });

  it('should combine badge and variant classes', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge variant="enhancement"></feedlog-badge>',
    });

    const span = page.root?.shadowRoot?.querySelector('span');
    const classes = span?.className;
    expect(classes).toContain('badge');
    expect(classes).toContain('badge-enhancement');
  });
});

describe('feedlog-badge - Slot Content', () => {
  it('should have slot for content', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge>Bug Report</feedlog-badge>',
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('should render slot with element children', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge><span>Icon</span> <span>Label</span></feedlog-badge>',
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('should support empty slot', async () => {
    const page = await newSpecPage({
      components: [FeedlogBadge],
      html: '<feedlog-badge></feedlog-badge>',
    });

    expect(page.root?.shadowRoot?.querySelector('span')).toBeDefined();
  });
});
