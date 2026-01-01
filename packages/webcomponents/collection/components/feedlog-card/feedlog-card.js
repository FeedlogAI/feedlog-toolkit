import { h } from '@stencil/core';
/**
 * Feedlog Card Component
 *
 * A reusable card container component with header and content areas.
 */
export class FeedlogCard {
  render() {
    return h(
      'div',
      { key: '349c032d1aa72c020a4f8949dec58c98e93f7459', class: 'feedlog-card' },
      h('slot', { key: '4587b8997083ed0de9dd542a6eaa3acfe3382248', name: 'header' }),
      h('slot', { key: '5374fbd26d864520ebbed62ce875f8d38674e3be', name: 'content' }),
      h('slot', { key: '5b9f9c9c1fc2e4e32575ad1d4a2504050e5beb8d', name: 'footer' })
    );
  }
  static get is() {
    return 'feedlog-card';
  }
  static get encapsulation() {
    return 'shadow';
  }
  static get originalStyleUrls() {
    return {
      $: ['feedlog-card.css'],
    };
  }
  static get styleUrls() {
    return {
      $: ['feedlog-card.css'],
    };
  }
}
//# sourceMappingURL=feedlog-card.js.map
