import { Component, h } from '@stencil/core';

/**
 * Feedlog Card Component
 *
 * A reusable card container component with header and content areas.
 */
@Component({
  tag: 'feedlog-card',
  styleUrl: 'feedlog-card.css',
  shadow: true,
})
export class FeedlogCard {
  render() {
    return (
      <div class="feedlog-card">
        <slot name="header"></slot>
        <slot name="content"></slot>
        <slot name="footer"></slot>
      </div>
    );
  }
}
