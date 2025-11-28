import { h, Host } from "@stencil/core";
/**
 * TrendingUp icon SVG component
 */
const TrendingUpIcon = () => (h("svg", { class: "upvote-icon", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17" }), h("polyline", { points: "16 7 22 7 22 13" })));
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
        return (h(Host, { key: 'fdce8e9a6312967fe50ae98a00023941e48a683d', class: this.theme === 'dark' ? 'dark' : '' }, h("div", { key: 'a178ca84ee83d9a8c45cf9f08bdae6fcecc51e1e', class: "issues-list" }, this.issues.map(issue => (h("div", { key: issue.id, class: "issue-card" }, h("div", { class: "issue-content" }, h("div", { class: "issue-main" }, h("div", { class: "issue-details" }, h("h3", { class: "issue-title" }, issue.title), h("p", { class: "issue-body" }, issue.body), h("div", { class: "issue-badge" }, issue.type === 'bug' ? (h("feedlog-badge", { variant: "destructive" }, "Bug")) : (h("feedlog-badge", { variant: "enhancement" }, "Enhancement")))), issue.type === 'enhancement' && (h("button", { class: "upvote-button", onClick: (e) => this.handleUpvote(e, issue.id) }, h(TrendingUpIcon, null), h("span", { class: "upvote-count" }, issue.upvotes || 0)))), issue.postedAt && (h("span", { class: "posted-at" }, "Posted ", issue.postedAt)))))))));
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
