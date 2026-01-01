import { h } from "@stencil/core";
/**
 * Feedlog Card Component
 *
 * A reusable card container component with header and content areas.
 */
export class FeedlogCard {
    render() {
        return (h("div", { key: '293a80e66adedfc1af29daf72390a4f464321b96', class: "feedlog-card" }, h("slot", { key: 'b7e5a827f89035e791d9c756db0f66198e6c5a38', name: "header" }), h("slot", { key: 'da89fee0a01068c8438564848f218faa9c5d849e', name: "content" }), h("slot", { key: '30b05e80e4189c0f73810a48f64e072dfac83267', name: "footer" })));
    }
    static get is() { return "feedlog-card"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feedlog-card.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feedlog-card.css"]
        };
    }
}
