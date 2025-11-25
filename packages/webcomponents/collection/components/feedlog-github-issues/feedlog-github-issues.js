import { h } from "@stencil/core";
/**
 * Feedlog GitHub Issues Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 */
export class FeedlogGithubIssues {
    constructor() {
        /**
         * Maximum width of the container
         */
        this.maxWidth = '56rem';
        this.handleUpvote = (event, issueId) => {
            event.stopPropagation();
            this.feedlogUpvote.emit(issueId);
        };
    }
    parseData() {
        if (!this.data) {
            return [];
        }
        if (typeof this.data === 'string') {
            try {
                return JSON.parse(this.data);
            }
            catch (_a) {
                return [];
            }
        }
        return Array.isArray(this.data) ? this.data : [];
    }
    renderBugIcon() {
        return (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "bug-icon" }, h("path", { d: "m8 2 1.88 1.88" }), h("path", { d: "M14.12 3.88 16 2" }), h("path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }), h("path", { d: "M12 20c-3.3 0-6-2.7-6-6v-4a6 6 0 0 1 12 0v4c0 3.3-2.7 6-6 6Z" }), h("path", { d: "M12 20v-9" }), h("path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }), h("path", { d: "M6 13H2" }), h("path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }), h("path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }), h("path", { d: "M22 13h-4" }), h("path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" }), h("path", { d: "M12 12l1.88-1.88" }), h("path", { d: "M12 12l-1.88-1.88" })));
    }
    renderThumbsUpIcon() {
        return (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "thumbs-up-icon" }, h("path", { d: "M7 10v12" }), h("path", { d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" })));
    }
    render() {
        const issues = this.parseData();
        const containerStyle = {
            maxWidth: this.maxWidth,
        };
        return (h("div", { key: '1e8eb797b97ac87300afa10ee71a515e849e27ce', class: "github-issues-container", style: containerStyle }, h("header", { key: '3f94a7970ba68fc877636ff13a2306434a4bcb94', class: "issues-header" }, h("h1", { key: 'e3acf1e16545221c644b84e5bccebdd48289f657', class: "issues-title" }, "GitHub Issues"), h("p", { key: '8cc2da8bf626fd3b149bd651db071b9a2413abfc', class: "issues-subtitle" }, "Track bugs and enhancements for your project")), h("div", { key: '4a3870f977d8a69d66d1832ce8f467e62e48dead', class: "issues-list" }, issues.map(issue => (h("feedlog-card", { key: issue.id, class: "issue-card" }, h("div", { slot: "header", class: "issue-header" }, h("div", { class: "issue-content-wrapper" }, issue.type === 'enhancement' && (h("feedlog-button", { variant: "outline", size: "sm", class: "upvote-button", onFeedlogClick: (e) => this.handleUpvote(e, issue.id) }, this.renderThumbsUpIcon(), h("span", { class: "upvote-count" }, issue.upvotes || 0))), issue.type === 'bug' && (h("div", { class: "bug-icon-wrapper" }, this.renderBugIcon())), h("div", { class: "issue-details" }, h("div", { class: "issue-title-row" }, h("h3", { class: "issue-title" }, issue.title), issue.type === 'bug' ? (h("feedlog-badge", { variant: "destructive" }, "Bug")) : (h("feedlog-badge", null, "Enhancement"))), h("p", { class: "issue-body" }, issue.body))))))))));
    }
    static get is() { return "feedlog-github-issues"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feedlog-github-issues.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feedlog-github-issues.css"]
        };
    }
    static get properties() {
        return {
            "data": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string | GitHubIssue[]",
                    "resolved": "GitHubIssue[] | string | undefined",
                    "references": {
                        "GitHubIssue": {
                            "location": "global",
                            "id": "global::GitHubIssue"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Issues data as JSON string or array"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "data"
            },
            "maxWidth": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Maximum width of the container"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "max-width",
                "defaultValue": "'56rem'"
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
//# sourceMappingURL=feedlog-github-issues.js.map
