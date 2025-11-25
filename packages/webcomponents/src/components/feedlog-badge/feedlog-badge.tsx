import { Component, Prop, h } from '@stencil/core';

/**
 * Feedlog Badge Component
 * 
 * A label component with variant support for different styles.
 */
@Component({
  tag: 'feedlog-badge',
  styleUrl: 'feedlog-badge.css',
  shadow: true,
})
export class FeedlogBadge {
  /**
   * Badge variant style
   */
  @Prop() variant: 'default' | 'destructive' = 'default';

  render() {
    return (
      <span class={`badge badge-${this.variant}`}>
        <slot></slot>
      </span>
    );
  }
}

