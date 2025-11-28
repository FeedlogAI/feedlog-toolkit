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
    render() {
        return (h(Host, { key: '4aebc8672aa96ea1404d4f889f9a428d1c1a27d7', class: this.theme === 'dark' ? 'dark' : '' }, h("div", { key: '8ab05bf07b0e6c85a4bf47bba5cec5b81545e80b', class: "issues-list" }, this.issues.map(issue => (h("feedlog-card", { key: issue.id, class: "issue-card" }, h("div", { slot: "header", class: "issue-header" }, h("div", { class: "issue-content-wrapper" }, issue.type === 'enhancement' && (h("feedlog-button", { variant: "outline", size: "sm", class: "upvote-button", onFeedlogClick: (e) => this.handleUpvote(e, issue.id) }, h("span", { class: "upvote-count" }, issue.upvotes || 0))), h("div", { class: "issue-details" }, h("div", { class: "issue-title-row" }, h("h3", { class: "issue-title" }, issue.title)), h("p", { class: "issue-body" }, issue.body)))), h("div", { slot: "footer", class: "issue-footer" }, issue.type === 'bug' ? (h("feedlog-badge", { variant: "destructive" }, "Bug")) : (h("feedlog-badge", null, "Enhancement")))))))));
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
