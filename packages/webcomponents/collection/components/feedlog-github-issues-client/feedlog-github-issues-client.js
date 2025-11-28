import { h } from "@stencil/core";
import { FeedlogSDK } from "@feedlog-toolkit/core";
/**
 * Feedlog GitHub Issues Client Component
 *
 * A component for displaying GitHub issues fetched using the Feedlog SDK.
 * This component uses the SDK internally to fetch data and delegates to feedlog-github-issues for rendering.
 */
export class FeedlogGithubIssuesClient {
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
        this.issues = [];
        this.loading = true;
        this.error = null;
        this.sdk = null;
        this.handleUpvote = (event) => {
            this.feedlogUpvote.emit(event.detail);
        };
        this.handleThemeChange = (event) => {
            this.feedlogThemeChange.emit(event.detail);
        };
    }
    componentWillLoad() {
        this.previousPk = this.pk;
        this.previousRepos = this.repos;
        this.initializeSDK();
        this.fetchIssues();
    }
    componentDidUpdate() {
        // Re-fetch if pk or repos changed
        const pkChanged = this.previousPk !== this.pk;
        const reposChanged = JSON.stringify(this.previousRepos) !== JSON.stringify(this.repos);
        if (pkChanged || reposChanged) {
            if (pkChanged) {
                this.initializeSDK();
            }
            this.fetchIssues();
            this.previousPk = this.pk;
            this.previousRepos = this.repos;
        }
    }
    initializeSDK() {
        if (!this.pk) {
            this.error = 'API key (pk) is required';
            this.loading = false;
            return;
        }
        this.sdk = new FeedlogSDK(this.pk);
    }
    parseRepos() {
        if (!this.repos) {
            return [];
        }
        if (typeof this.repos === 'string') {
            try {
                const parsed = JSON.parse(this.repos);
                return Array.isArray(parsed) ? parsed : [];
            }
            catch (_a) {
                // If not valid JSON, treat as single repo string
                return [this.repos];
            }
        }
        return Array.isArray(this.repos) ? this.repos : [];
    }
    async fetchIssues() {
        if (!this.sdk) {
            return;
        }
        const repos = this.parseRepos();
        if (repos.length === 0) {
            this.error = 'At least one repository is required';
            this.loading = false;
            return;
        }
        try {
            this.loading = true;
            this.error = null;
            this.issues = await this.sdk.fetchIssues(repos);
        }
        catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to fetch issues';
            this.issues = [];
        }
        finally {
            this.loading = false;
        }
    }
    render() {
        return (h("feedlog-github-issues", { key: '38b1f084bd7a44bd45d1809b9c78d317691a5c70', issues: this.issues, maxWidth: this.maxWidth, theme: this.theme, showThemeToggle: this.showThemeToggle, loading: this.loading, error: this.error, onFeedlogUpvote: this.handleUpvote, onFeedlogThemeChange: this.handleThemeChange }));
    }
    static get is() { return "feedlog-github-issues-client"; }
    static get encapsulation() { return "shadow"; }
    static get properties() {
        return {
            "pk": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "API key (public key) for the Feedlog SDK"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "pk"
            },
            "repos": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string[] | string",
                    "resolved": "string | string[] | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Array of repository IDs (e.g., ['owner/repo']) or JSON string"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "repos"
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
    static get states() {
        return {
            "issues": {},
            "loading": {},
            "error": {}
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
//# sourceMappingURL=feedlog-github-issues-client.js.map
