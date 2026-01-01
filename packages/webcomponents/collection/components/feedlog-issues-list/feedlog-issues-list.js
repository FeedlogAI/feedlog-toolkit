import { h, Host } from "@stencil/core";
/**
 * Heart icon SVG component (filled)
 */
const HeartFilledIcon = () => (h("svg", { class: "upvote-icon filled", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", stroke: "none" }, h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })));
/**
 * Heart icon SVG component (outline)
 */
const HeartOutlineIcon = () => (h("svg", { class: "upvote-icon outline", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })));
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
        this.handleUpvote = (event, issue) => {
            event.stopPropagation();
            this.feedlogUpvote.emit({
                issueId: issue.id,
                currentUpvoted: issue.hasUpvoted,
                currentCount: issue.upvoteCount,
            });
        };
    }
    render() {
        return (h(Host, { key: 'd153440587f93dc99a2677b3f7ba4c76e037ee6c', class: this.theme === 'dark' ? 'dark' : '' }, h("div", { key: '527b319e821ab1479527d498a809e9ea538a269f', class: "issues-list" }, this.issues.length === 0 ? (h("div", { class: "empty-state" }, h("p", null, "No issues found"))) : (this.issues.map(issue => (h("div", { key: issue.id, class: "issue-card" }, h("div", { class: "issue-content" }, h("div", { class: "issue-header" }, h("div", { class: "issue-type-badge" }, issue.type === 'bug' ? (h("feedlog-badge", { variant: "destructive" }, "Bug")) : (h("feedlog-badge", { variant: "enhancement" }, "Enhancement"))), issue.pinnedAt && (h("div", { class: "pinned-indicator", title: "Pinned issue" }, "\uD83D\uDCCC"))), h("div", { class: "issue-main" }, h("div", { class: "issue-details" }, h("h3", { class: "issue-title" }, issue.title), h("p", { class: "issue-body" }, issue.body), h("div", { class: "issue-repository" }, h("span", { class: "repo-name" }, issue.repository.owner, "/", issue.repository.name), issue.githubIssueNumber > 0 && (h("span", { class: "github-number" }, "#", issue.githubIssueNumber)))), h("button", { class: `upvote-button ${issue.hasUpvoted ? 'upvoted' : ''}`, onClick: (e) => this.handleUpvote(e, issue), title: issue.hasUpvoted ? 'Remove upvote' : 'Upvote this issue' }, issue.hasUpvoted ? h(HeartFilledIcon, null) : h(HeartOutlineIcon, null), h("span", { class: "upvote-count" }, issue.upvoteCount))), h("div", { class: "issue-footer" }, h("span", { class: "issue-date", title: `Updated: ${issue.updatedAt}` }, "Updated ", this.formatDate(issue.updatedAt)), h("span", { class: "issue-date", title: `Created: ${issue.createdAt}` }, "Created ", this.formatDate(issue.createdAt)))))))))));
    }
    /**
     * Format an ISO date string to a relative time string
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            if (seconds < 60)
                return 'just now';
            if (seconds < 3600)
                return `${Math.floor(seconds / 60)}m ago`;
            if (seconds < 86400)
                return `${Math.floor(seconds / 3600)}h ago`;
            if (seconds < 604800)
                return `${Math.floor(seconds / 86400)}d ago`;
            if (seconds < 2592000)
                return `${Math.floor(seconds / 604800)}w ago`;
            return date.toLocaleDateString();
        }
        catch (_a) {
            return 'unknown date';
        }
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
                    "original": "FeedlogIssue[]",
                    "resolved": "FeedlogIssue[]",
                    "references": {
                        "FeedlogIssue": {
                            "location": "import",
                            "path": "@feedlog-toolkit/core",
                            "id": "../core/dist/index.d.ts::FeedlogIssue"
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
                    "original": "{\n    issueId: string;\n    currentUpvoted: boolean;\n    currentCount: number;\n  }",
                    "resolved": "{ issueId: string; currentUpvoted: boolean; currentCount: number; }",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=feedlog-issues-list.js.map
