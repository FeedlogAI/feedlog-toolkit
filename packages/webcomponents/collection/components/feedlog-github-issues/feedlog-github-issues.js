import { h, Host } from "@stencil/core";
/**
 * Sun icon SVG component
 */
const SunIcon = () => (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("circle", { cx: "12", cy: "12", r: "4" }), h("path", { d: "M12 2v2" }), h("path", { d: "M12 20v2" }), h("path", { d: "m4.93 4.93 1.41 1.41" }), h("path", { d: "m17.66 17.66 1.41 1.41" }), h("path", { d: "M2 12h2" }), h("path", { d: "M20 12h2" }), h("path", { d: "m6.34 17.66-1.41 1.41" }), h("path", { d: "m19.07 4.93-1.41 1.41" })));
/**
 * Moon icon SVG component
 */
const MoonIcon = () => (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" })));
/**
 * Feedlog GitHub Issues Component
 *
 * Component for displaying GitHub issues with support for bugs and enhancements.
 * This component handles the UI rendering and delegates to feedlog-issues-list for the actual list.
 */
export class FeedlogGithubIssues {
    constructor() {
        /**
         * Array of issues to display
         */
        this.issues = [];
        /**
         * Maximum width of the container
         */
        this.maxWidth = '42rem';
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
        /**
         * Whether to show the theme toggle button
         */
        this.showThemeToggle = true;
        /**
         * Internal state for theme
         */
        this.currentTheme = 'light';
        this.handleUpvote = (event) => {
            this.feedlogUpvote.emit(event.detail);
        };
        this.toggleTheme = () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.theme = this.currentTheme;
            this.feedlogThemeChange.emit(this.currentTheme);
        };
    }
    componentWillLoad() {
        this.currentTheme = this.theme;
    }
    render() {
        const containerStyle = {
            maxWidth: this.maxWidth,
        };
        return (h(Host, { key: '5d6203df6327ffff8f17da5fffd43993d442a60b', class: this.currentTheme === 'dark' ? 'dark' : '' }, h("div", { key: 'ac9bcac5bc23ecbc7ea79c32eecc14b3ecc8b530', class: "github-issues-container", style: containerStyle }, h("header", { key: 'f7950ec9a7a84fafb74d80648372ba7d85acfc6a', class: "issues-header" }, h("div", { key: 'bec0c5385ae569556f8f12d18d991f12dd732760', class: "header-content" }, h("h1", { key: '07576812a0c43c81b4ec83ac2fd106b24504148a', class: "issues-title" }, "GitHub Issues"), h("p", { key: '1e19055e3f328f5fd516aebcc3c736669ba0573d', class: "issues-subtitle" }, "Track bugs and enhancements for your project")), this.showThemeToggle && (h("feedlog-button", { key: 'f26360f4df8dd2fca4be7826ccfd2741d03a3239', variant: "outline", size: "sm", onFeedlogClick: this.toggleTheme }, this.currentTheme === 'dark' ? h(SunIcon, null) : h(MoonIcon, null)))), this.loading && (h("div", { key: '32779a0980c5ebcc259f042c6d34df96040db6f9', class: "loading-state" }, h("p", { key: 'b9acf33f1fc35ed634501ad81ce1b6ea1813ce9e' }, "Loading issues..."))), this.error && (h("div", { key: '996ca69d9476e741c85eb505e29384fccb47700c', class: "error-state" }, h("p", { key: '717ba2ef46c2a2b0873faa51cdb3513376d5bc99' }, "Error: ", this.error))), !this.loading && !this.error && (h("feedlog-issues-list", { key: '5a91b17fcd67198209af0f0f18b7331ecaeb2d73', issues: this.issues, theme: this.currentTheme, onFeedlogUpvote: this.handleUpvote })))));
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
                "defaultValue": "'42rem'"
            },
            "theme": {
                "type": "string",
                "mutable": true,
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
    static get states() {
        return {
            "currentTheme": {}
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
