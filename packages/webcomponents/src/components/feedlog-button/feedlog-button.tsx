import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * Feedlog Button Component
 * 
 * A button component with variant and size support.
 */
@Component({
  tag: 'feedlog-button',
  styleUrl: 'feedlog-button.css',
  shadow: true,
})
export class FeedlogButton {
  /**
   * Button variant style
   */
  @Prop() variant: 'default' | 'outline' | 'ghost' | 'destructive' = 'default';

  /**
   * Button size
   */
  @Prop() size: 'default' | 'sm' | 'lg' = 'default';

  /**
   * Disabled state
   */
  @Prop() disabled: boolean = false;

  /**
   * Button type
   */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Event emitted when button is clicked
   */
  @Event() feedlogClick!: EventEmitter<MouseEvent>;

  private handleClick = (event: MouseEvent) => {
    if (!this.disabled) {
      this.feedlogClick.emit(event);
    }
  };

  render() {
    const sizeClass = this.size === 'default' ? 'button-size-default' : `button-size-${this.size}`;
    return (
      <button
        type={this.type}
        class={`button button-${this.variant} ${sizeClass}`}
        disabled={this.disabled}
        onClick={this.handleClick}
      >
        <slot></slot>
      </button>
    );
  }
}

