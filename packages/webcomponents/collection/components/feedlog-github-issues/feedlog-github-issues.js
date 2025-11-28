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
        this.maxWidth = '42rem';
        /**
         * Theme variant: 'light' or 'dark'
         */
        this.theme = 'light';
        /**
         * Whether to show the theme toggle button
         */
        this.showThemeToggle = true;
        this.handleUpvote = (event) => {
            this.feedlogUpvote.emit(event.detail);
        };
        this.handleThemeChange = (event) => {
            this.feedlogThemeChange.emit(event.detail);
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
        return (h("feedlog-github-issues-base", { key: '571f86cb7c9e12bdcccd7d7816f18ed2530fbe85', issues: issues, maxWidth: this.maxWidth, theme: this.theme, showThemeToggle: this.showThemeToggle, loading: false, error: null, onFeedlogUpvote: this.handleUpvote, onFeedlogThemeChange: this.handleThemeChange }));
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
                "defaultValue": "'42rem'"
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
            "showThemeToggle": {
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
                    "text": "Whether to show the theme toggle button"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-theme-toggle",
                "defaultValue": "true"
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
            }, {
                "method": "feedlogThemeChange",
                "name": "feedlogThemeChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Event emitted when theme changes"
                },
                "complexType": {
                    "original": "'light' | 'dark'",
                    "resolved": "\"dark\" | \"light\"",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=feedlog-github-issues.js.map
