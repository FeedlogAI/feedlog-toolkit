import { h } from "@stencil/core";
/**
 * Feedlog Button Component
 *
 * A button component with variant and size support.
 */
export class FeedlogButton {
    constructor() {
        /**
         * Button variant style
         */
        this.variant = 'default';
        /**
         * Button size
         */
        this.size = 'default';
        /**
         * Disabled state
         */
        this.disabled = false;
        /**
         * Button type
         */
        this.type = 'button';
        this.handleClick = (event) => {
            if (!this.disabled) {
                this.feedlogClick.emit(event);
            }
        };
    }
    render() {
        const sizeClass = this.size === 'default' ? 'button-size-default' : `button-size-${this.size}`;
        return (h("button", { key: '6cdd8347def51592707b1fb9aab0dc565ca0f76f', type: this.type, class: `button button-${this.variant} ${sizeClass}`, disabled: this.disabled, onClick: this.handleClick }, h("slot", { key: '3f3845195fa4b8a551473ecf1d5702321a31763e' })));
    }
    static get is() { return "feedlog-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feedlog-button.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feedlog-button.css"]
        };
    }
    static get properties() {
        return {
            "variant": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'default' | 'outline' | 'ghost' | 'destructive'",
                    "resolved": "\"default\" | \"destructive\" | \"ghost\" | \"outline\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Button variant style"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "variant",
                "defaultValue": "'default'"
            },
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'default' | 'sm' | 'lg'",
                    "resolved": "\"default\" | \"lg\" | \"sm\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Button size"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "size",
                "defaultValue": "'default'"
            },
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Disabled state"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'button' | 'submit' | 'reset'",
                    "resolved": "\"button\" | \"reset\" | \"submit\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Button type"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "type",
                "defaultValue": "'button'"
            }
        };
    }
    static get events() {
        return [{
                "method": "feedlogClick",
                "name": "feedlogClick",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Event emitted when button is clicked"
                },
                "complexType": {
                    "original": "MouseEvent",
                    "resolved": "MouseEvent",
                    "references": {
                        "MouseEvent": {
                            "location": "global",
                            "id": "global::MouseEvent"
                        }
                    }
                }
            }];
    }
}
