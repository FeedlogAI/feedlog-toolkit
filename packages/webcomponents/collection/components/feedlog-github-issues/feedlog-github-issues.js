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
         * Whether there are more issues to load
         */
        this.hasMore = false;
        /**
         * Whether more issues are currently loading
         */
        this.isLoadingMore = false;
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
        this.handleLoadMore = () => {
            this.feedlogLoadMore.emit();
        };
    }
    componentWillLoad() {
        this.currentTheme = this.theme;
    }
    render() {
        const containerStyle = {
            maxWidth: this.maxWidth,
        };
        return (h(Host, { key: '2e0e956cb882411286400a4847c85ced2444914b', class: this.currentTheme === 'dark' ? 'dark' : '' }, h("div", { key: 'cdb3a6bcfcebb2028afcb83f50174159ba6a0e3a', class: "github-issues-container", style: containerStyle }, h("header", { key: '9735c3576cbdb911eafe80ceba050f88057171f6', class: "issues-header" }, h("div", { key: '6f624b5b9c1c2c2ede4e292883fef084ff0a2802', class: "header-content" }, h("h1", { key: '00fb0c4b3e2f2937d2c6faffd9758d66c44b8fe9', class: "issues-title" }, "GitHub Issues"), h("p", { key: 'db5c8548fdbacd79f26b431f2dab9e537f386204', class: "issues-subtitle" }, "Track bugs and enhancements for your project")), this.showThemeToggle && (h("feedlog-button", { key: '9dcc031dd8416f7dac67f22282c5dd6eb356d3b2', variant: "outline", size: "sm", onFeedlogClick: this.toggleTheme }, this.currentTheme === 'dark' ? h(SunIcon, null) : h(MoonIcon, null)))), this.loading && (h("div", { key: '7795e4bcd363399b49813b4a4721fb83e34c9c31', class: "loading-state" }, h("p", { key: '8ed7560b391d7779d9fc3639da327899e2879551' }, "Loading issues..."))), this.error && (h("div", { key: '773f94300464e2a1fa51c57d44b1a2b7807d45c7', class: "error-state" }, h("p", { key: 'd920c92f9e264a03509770f09268eced5f1675a3' }, "Error: ", this.error))), !this.loading && !this.error && (h("div", { key: '17c8d212b1679d8ed71a65340c7c5cf99de73408' }, h("feedlog-issues-list", { key: '1031ea468a844554346a10b34804e9bb1d84ce12', issues: this.issues, theme: this.currentTheme, onFeedlogUpvote: this.handleUpvote }), this.hasMore && (h("div", { key: 'ff122f1061f448ec8eb6637abd18544e3d5a36fb', class: "load-more-container" }, h("feedlog-button", { key: '3ceba6cefe5073efbf98498f5b7de72d39014e58', onFeedlogClick: this.handleLoadMore, disabled: this.isLoadingMore, variant: "outline" }, this.isLoadingMore ? 'Loading...' : 'Load More Issues'))))))));
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
            },
            "hasMore": {
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
                    "text": "Whether there are more issues to load"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "has-more",
                "defaultValue": "false"
            },
            "isLoadingMore": {
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
                    "text": "Whether more issues are currently loading"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "is-loading-more",
                "defaultValue": "false"
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
                    "original": "{\n    issueId: string;\n    currentUpvoted: boolean;\n    currentCount: number;\n  }",
                    "resolved": "{ issueId: string; currentUpvoted: boolean; currentCount: number; }",
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
            }, {
                "method": "feedlogLoadMore",
                "name": "feedlogLoadMore",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Event emitted to load more issues"
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=feedlog-github-issues.js.map
