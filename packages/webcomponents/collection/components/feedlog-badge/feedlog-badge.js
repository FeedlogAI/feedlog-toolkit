import { h } from "@stencil/core";
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
        return (h("span", { key: '482a74feb8d254a75383c30c7b39790edd04a05b', class: `badge badge-${this.variant}` }, h("slot", { key: '8d2db3fe0c2bc58e17829db4de7d0233189bb101' })));
    }
    static get is() { return "feedlog-badge"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feedlog-badge.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feedlog-badge.css"]
        };
    }
    static get properties() {
        return {
            "variant": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'default' | 'destructive' | 'enhancement'",
                    "resolved": "\"default\" | \"destructive\" | \"enhancement\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Badge variant style"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "variant",
                "defaultValue": "'default'"
            }
        };
    }
}
