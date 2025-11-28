import { h, Host } from "@stencil/core";
/**
 * Feedlog GitHub Issues Base Component
 *
 * Shared base component for displaying GitHub issues with support for bugs and enhancements.
 * This component handles the UI rendering and delegates to feedlog-issues-list for the actual list.
 */
export class FeedlogGithubIssuesBase {
    constructor() {
        /**
         * Array of issues to display
         */
        this.issues = [];
        /**
         * Maximum width of the container
         */
        this.maxWidth = '56rem';
        /**
         * Theme variant: 'light' or 'dark'
         */
        this.theme = 'light';
        /**
         * Loading state - shows loading indicator when true
         */
        this.loading = false;
        /**
         * Error message - shows error state when set
         */
        this.error = null;
        this.handleUpvote = (event) => {
            this.feedlogUpvote.emit(event.detail);
        };
    }
    render() {
        const containerStyle = {
            maxWidth: this.maxWidth,
        };
        return (h(Host, { key: '3d7c74d415fd23f611454ff62fe8e4e0dac5356e', class: this.theme === 'dark' ? 'dark' : '' }, h("div", { key: '163d381282cb01aa99b6c81d136385674b5cbcb9', class: "github-issues-container", style: containerStyle }, h("header", { key: '3342d068a515ccf3f7d32cb61d123c2187e061b3', class: "issues-header" }, h("h1", { key: 'feb9f37b8db302e334b3e8fde0c29d08df3129aa', class: "issues-title" }, "GitHub Issues"), h("p", { key: 'dc766e1b6c8b6b281012caaa09572d250fc87697', class: "issues-subtitle" }, "Track bugs and enhancements for your project")), this.loading && (h("div", { key: '07e054073129ed887a84e5fb306e720ffb990509', class: "loading-state" }, h("p", { key: '0ced9b6e9a6cfaf16c90652f9e4e59ec9382a24a' }, "Loading issues..."))), this.error && (h("div", { key: 'fa3c422646152a3a77124fb587bdbba48e8b1f6c', class: "error-state" }, h("p", { key: 'e2da9404069769ea18a489e0ab183f15dcb95955' }, "Error: ", this.error))), !this.loading && !this.error && (h("feedlog-issues-list", { key: '2e7ab4b8770e54135936210a56f7ca842e21875d', issues: this.issues, theme: this.theme, onFeedlogUpvote: this.handleUpvote })))));
    }
    static get is() { return "feedlog-github-issues-base"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feedlog-github-issues-base.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feedlog-github-issues-base.css"]
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
                            "location": "import",
                            "path": "@feedlog-toolkit/core",
                            "id": "../core/dist/index.d.ts::GitHubIssue"
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
            },
            "loading": {
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
                    "text": "Loading state - shows loading indicator when true"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "loading",
                "defaultValue": "false"
            },
            "error": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string | null",
                    "resolved": "null | string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Error message - shows error state when set"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "error",
                "defaultValue": "null"
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
//# sourceMappingURL=feedlog-github-issues-base.js.map
