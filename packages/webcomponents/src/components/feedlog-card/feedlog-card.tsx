import { Component, Element, Prop, State, h } from '@stencil/core';

let cardInstanceId = 0;

function nextContentRegionId(): string {
  cardInstanceId += 1;
  return `feedlog-card-body-${cardInstanceId}`;
}

@Component({
  tag: 'feedlog-card',
  styleUrl: 'feedlog-card.css',
  shadow: true,
})
export class FeedlogCard {
  @Element() host!: HTMLElement;

  /** When true, header toggles collapsing the content slot; footer stays visible. Default off. */
  @Prop() collapsible: boolean = false;

  /**
   * Flat surface (no inner card border/shadow) for nesting inside another shell (e.g. feedlog-issue).
   */
  @Prop({ reflect: true }) embed: boolean = false;

  @State() bodyExpanded: boolean = false;

  @State() hasContentSlot: boolean = false;

  @State() hasFooterSlot: boolean = false;

  private contentRegionId = nextContentRegionId();

  private contentSlot?: HTMLSlotElement;

  private footerSlot?: HTMLSlotElement;

  componentWillRender() {
    const sr = this.host.shadowRoot;
    if (!sr) return;
    const content = sr.querySelector('slot[name="content"]') as HTMLSlotElement | null;
    if (content && this.contentSlot !== content) {
      this.contentSlot?.removeEventListener('slotchange', this.handleContentSlotChange);
      this.contentSlot = content;
      this.contentSlot.addEventListener('slotchange', this.handleContentSlotChange);
    }
    const footer = sr.querySelector('slot[name="footer"]') as HTMLSlotElement | null;
    if (footer && this.footerSlot !== footer) {
      this.footerSlot?.removeEventListener('slotchange', this.handleFooterSlotChange);
      this.footerSlot = footer;
      this.footerSlot.addEventListener('slotchange', this.handleFooterSlotChange);
    }
    this.syncContentSlotPresence();
    this.syncFooterSlotPresence();
  }

  componentDidLoad() {
    const sr = this.host.shadowRoot;
    if (!sr) return;
    const content = sr.querySelector('slot[name="content"]') as HTMLSlotElement | null;
    if (content) {
      if (this.contentSlot !== content) {
        this.contentSlot?.removeEventListener('slotchange', this.handleContentSlotChange);
        this.contentSlot = content;
        this.contentSlot.addEventListener('slotchange', this.handleContentSlotChange);
      }
      this.syncContentSlotPresence();
    }
    const footer = sr.querySelector('slot[name="footer"]') as HTMLSlotElement | null;
    if (footer) {
      if (this.footerSlot !== footer) {
        this.footerSlot?.removeEventListener('slotchange', this.handleFooterSlotChange);
        this.footerSlot = footer;
        this.footerSlot.addEventListener('slotchange', this.handleFooterSlotChange);
      }
      this.syncFooterSlotPresence();
    }
  }

  disconnectedCallback() {
    this.contentSlot?.removeEventListener('slotchange', this.handleContentSlotChange);
    this.footerSlot?.removeEventListener('slotchange', this.handleFooterSlotChange);
  }

  private handleContentSlotChange = () => {
    this.syncContentSlotPresence();
  };

  private handleFooterSlotChange = () => {
    this.syncFooterSlotPresence();
  };

  private syncContentSlotPresence() {
    const slot =
      this.contentSlot ??
      (this.host.shadowRoot?.querySelector('slot[name="content"]') as HTMLSlotElement | null);
    if (!slot) {
      this.hasContentSlot = false;
      return;
    }
    const nodes = slot.assignedNodes({ flatten: true });
    const has = nodes.some(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        return (n as Text).textContent?.trim() !== '';
      }
      if (n.nodeType === Node.ELEMENT_NODE) {
        return true;
      }
      return false;
    });
    this.hasContentSlot = has;
  }

  private syncFooterSlotPresence() {
    const slot =
      this.footerSlot ??
      (this.host.shadowRoot?.querySelector('slot[name="footer"]') as HTMLSlotElement | null);
    if (!slot) {
      this.hasFooterSlot = false;
      return;
    }
    const nodes = slot.assignedNodes({ flatten: true });
    const has = nodes.some(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        return (n as Text).textContent?.trim() !== '';
      }
      if (n.nodeType === Node.ELEMENT_NODE) {
        return true;
      }
      return false;
    });
    this.hasFooterSlot = has;
  }

  private toggleBody = () => {
    if (!this.collapsible || !this.hasContentSlot) return;
    this.bodyExpanded = !this.bodyExpanded;
  };

  /** Clicks on title/content in the header toggle the body; links and controls do not. */
  private onHeaderMainClick = (e: MouseEvent) => {
    if (!this.collapsible || !this.hasContentSlot) return;
    const path = e.composedPath();
    for (const node of path) {
      if (!(node instanceof HTMLElement)) continue;
      const tag = node.tagName;
      if (
        tag === 'A' ||
        tag === 'BUTTON' ||
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT'
      ) {
        return;
      }
      if (tag === 'FEEDLOG-BADGE') {
        return;
      }
      const role = node.getAttribute('role');
      if (role === 'button' || role === 'link') {
        return;
      }
      if (node.isContentEditable || node.getAttribute('contenteditable') === 'true') {
        return;
      }
    }
    this.toggleBody();
  };

  private onHeaderChevronClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.toggleBody();
  };

  render() {
    const showToggle = this.collapsible && this.hasContentSlot;
    const bodyCollapsed = showToggle && !this.bodyExpanded;
    /** Divider above footer: hidden while body is collapsed so header + footer read as one block. */
    const showFooterTopBorder = this.hasFooterSlot && !bodyCollapsed;
    const expandAriaLabel = this.bodyExpanded ? 'Collapse details' : 'Expand details';

    return (
      <div class={{ 'feedlog-card': true, 'feedlog-card--embed': this.embed }}>
        <div
          class={{
            'feedlog-card__header': true,
            'feedlog-card__header--collapsible': showToggle,
          }}
        >
          <div class="feedlog-card__header-main" onClick={this.onHeaderMainClick}>
            <slot name="header"></slot>
          </div>
          {showToggle ? (
            <button
              type="button"
              class="feedlog-card__header-toggle"
              aria-expanded={this.bodyExpanded ? 'true' : 'false'}
              aria-controls={this.contentRegionId}
              aria-label={expandAriaLabel}
              title={expandAriaLabel}
              onClick={this.onHeaderChevronClick}
            >
              <svg
                class={{
                  'feedlog-card__header-toggle-icon': true,
                  'feedlog-card__header-toggle-icon--expanded': this.bodyExpanded,
                }}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Remix Icon arrow-up-s-line — https://allsvgicons.com/pack/ri/#arrow-up-s-line (Apache-2.0) */}
                <path
                  fill="currentColor"
                  d="m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z"
                />
              </svg>
            </button>
          ) : null}
        </div>
        {showToggle ? (
          <div id={this.contentRegionId} class="feedlog-card__body" hidden={bodyCollapsed}>
            <slot name="content"></slot>
          </div>
        ) : (
          <slot name="content"></slot>
        )}
        <div
          class={{
            'feedlog-card__footer-wrap': true,
            'feedlog-card__footer-wrap--has-footer': showFooterTopBorder,
          }}
        >
          <slot name="footer"></slot>
        </div>
      </div>
    );
  }
}
