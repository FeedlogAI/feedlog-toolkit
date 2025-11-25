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
        return (h("span", { key: '806ea58eca5ff9b2f441309a853e455a1d043d17', class: `badge badge-${this.variant}` }, h("slot", { key: '3eba106b833c0b828d11b43455909bd07061c09c' })));
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
                    "original": "'default' | 'destructive'",
                    "resolved": "\"default\" | \"destructive\"",
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
//# sourceMappingURL=feedlog-badge.js.map
