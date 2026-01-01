import { h } from '@stencil/core';
/**
 * Feedlog Badge Component
 *
 * A label component with variant support for different styles.
 */
export class FeedlogBadge {
  constructor() {
    /**
     * Badge variant style
     */
    this.variant = 'default';
  }
  render() {
    return h(
      'span',
      { key: '7083252523527e2c714694fb23cb5dbcc5247681', class: `badge badge-${this.variant}` },
      h('slot', { key: 'fb561a8635cdeecc3dd150197ddee98f137d26ff' })
    );
  }
  static get is() {
    return 'feedlog-badge';
  }
  static get encapsulation() {
    return 'shadow';
  }
  static get originalStyleUrls() {
    return {
      $: ['feedlog-badge.css'],
    };
  }
  static get styleUrls() {
    return {
      $: ['feedlog-badge.css'],
    };
  }
  static get properties() {
    return {
      variant: {
        type: 'string',
        mutable: false,
        complexType: {
          original: "'default' | 'destructive' | 'enhancement'",
          resolved: '"default" | "destructive" | "enhancement"',
          references: {},
        },
        required: false,
        optional: false,
        docs: {
          tags: [],
          text: 'Badge variant style',
        },
        getter: false,
        setter: false,
        reflect: false,
        attribute: 'variant',
        defaultValue: "'default'",
      },
    };
  }
}
//# sourceMappingURL=feedlog-badge.js.map
