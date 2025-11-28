import { h, Host } from "@stencil/core";
/**
 * Feedlog Issues List Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 */
export class FeedlogIssuesList {
    constructor() {
        /**
         * Array of issues to display
         */
        this.issues = [];
        /**
         * Theme variant: 'light' or 'dark'
         */
        this.theme = 'light';
        this.handleUpvote = (event, issueId) => {
            event.stopPropagation();
            this.feedlogUpvote.emit(issueId);
        };
    }
    renderBugIcon() {
        return (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "bug-icon" }, h("path", { d: "m8 2 1.88 1.88" }), h("path", { d: "M14.12 3.88 16 2" }), h("path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }), h("path", { d: "M12 20c-3.3 0-6-2.7-6-6v-4a6 6 0 0 1 12 0v4c0 3.3-2.7 6-6 6Z" }), h("path", { d: "M12 20v-9" }), h("path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }), h("path", { d: "M6 13H2" }), h("path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }), h("path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }), h("path", { d: "M22 13h-4" }), h("path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" }), h("path", { d: "M12 12l1.88-1.88" }), h("path", { d: "M12 12l-1.88-1.88" })));
    }
    renderThumbsUpIcon() {
        return (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "thumbs-up-icon" }, h("path", { d: "M7 10v12" }), h("path", { d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" })));
    }
    render() {
        return (h(Host, { key: '52627dfcb6665b3fb2ea9177d6cdc0718ef3357f', class: this.theme === 'dark' ? 'dark' : '' }, h("div", { key: 'b42c4f0cdda39e6f0c105dd8deec444386f2d53b', class: "issues-list" }, this.issues.map(issue => (h("feedlog-card", { key: issue.id, class: "issue-card" }, h("div", { slot: "header", class: "issue-header" }, h("div", { class: "issue-content-wrapper" }, issue.type === 'enhancement' && (h("feedlog-button", { variant: "outline", size: "sm", class: "upvote-button", onFeedlogClick: (e) => this.handleUpvote(e, issue.id) }, this.renderThumbsUpIcon(), h("span", { class: "upvote-count" }, issue.upvotes || 0))), issue.type === 'bug' && (h("div", { class: "bug-icon-wrapper" }, this.renderBugIcon())), h("div", { class: "issue-details" }, h("div", { class: "issue-title-row" }, h("h3", { class: "issue-title" }, issue.title), issue.type === 'bug' ? (h("feedlog-badge", { variant: "destructive" }, "Bug")) : (h("feedlog-badge", null, "Enhancement"))), h("p", { class: "issue-body" }, issue.body))))))))));
    }
    static get is() { return "feedlog-issues-list"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feedlog-issues-list.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feedlog-issues-list.css"]
        };
    }
    static get properties() {
        return {
            "issues": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "GitHubIssue[]",
                    "resolved": "GitHubIssue[]",
                    "references": {
                        "GitHubIssue": {
                            "location": "global",
                            "id": "global::GitHubIssue"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Array of issues to display"
                },
                "getter": false,
                "setter": false,
                "defaultValue": "[]"
            },
            "theme": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'light' | 'dark'",
                    "resolved": "\"dark\" | \"light\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Theme variant: 'light' or 'dark'"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "theme",
                "defaultValue": "'light'"
            }
        };
    }
    static get events() {
        return [{
                "method": "feedlogUpvote",
                "name": "feedlogUpvote",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Event emitted when an issue is upvoted"
                },
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=feedlog-issues-list.js.map
