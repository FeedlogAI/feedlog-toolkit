import { h } from "@stencil/core";
/**
 * Feedlog GitHub Issues Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 * This component accepts data directly and delegates to the base component for rendering.
 */
export class FeedlogGithubIssues {
    constructor() {
        /**
         * Maximum width of the container
         */
        this.maxWidth = '56rem';
        /**
         * Theme variant: 'light' or 'dark'
         */
        this.theme = 'light';
        this.handleUpvote = (event) => {
            this.feedlogUpvote.emit(event.detail);
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
    render() {
        const issues = this.parseData();
        return (h("feedlog-github-issues-base", { key: '3930e2562bd370186c0cee2e3c969ea506fb6009', issues: issues, maxWidth: this.maxWidth, theme: this.theme, loading: false, error: null, onFeedlogUpvote: this.handleUpvote }));
    }
    static get is() { return "feedlog-github-issues"; }
    static get encapsulation() { return "shadow"; }
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
                            "location": "import",
                            "path": "@feedlog-toolkit/core",
                            "id": "../core/dist/index.d.ts::GitHubIssue"
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
//# sourceMappingURL=feedlog-github-issues.js.map
