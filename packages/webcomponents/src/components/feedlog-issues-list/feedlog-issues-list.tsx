import { Component, Prop, State, Event, EventEmitter, h, Host, Watch } from '@stencil/core';
import type { FeedlogIssue as FeedlogIssueType, GetIssueUrlFn } from '@feedlog-ai/core';

/**
 * Feedlog Issues List Component
 *
 * A component for displaying a list of GitHub issues with support for bugs and enhancements.
 */
@Component({
  tag: 'feedlog-issues-list',
  styleUrl: 'feedlog-issues-list.css',
  shadow: true,
})
export class FeedlogIssuesList {
  /**
   * Array of issues to display
   */
  @Prop() issues: FeedlogIssueType[] = [];

  /**
   * Page size (items per page). When set, enables pagination when issues exceed this limit.
   */
  @Prop() limit?: number;

  /**
   * Theme variant: 'light' or 'dark'
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  @State() currentPage: number = 1;

  @Watch('issues')
  @Watch('limit')
  resetPage() {
    this.currentPage = 1;
  }

  /**
   * Optional callback to resolve GitHub issue URL when githubIssueLink is not available.
   */
  @Prop() getIssueUrl?: GetIssueUrlFn;

  /**
   * Empty state title. When provided with emptyStateMessage, shows a richer empty state with illustration.
   */
  @Prop() emptyStateTitle?: string;

  /**
   * Empty state message. When provided with emptyStateTitle, shows a richer empty state with illustration.
   */
  @Prop() emptyStateMessage?: string;

  /**
   * Emitted when an issue is upvoted
   */
  @Event() feedlogUpvote!: EventEmitter<{
    issueId: string;
    currentUpvoted: boolean;
    currentCount: number;
  }>;

  private renderEmptyStateIllustration() {
    return (
      <svg
        class="empty-state-illustration"
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="96"
        viewBox="0 0 120 96"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 36h80v44c0 4.4-3.6 8-8 8H28c-4.4 0-8-3.6-8-8V36z"
          fill="var(--feedlog-empty-illustration-bg)"
          stroke="var(--feedlog-empty-illustration-stroke)"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M20 36l20-24h40l20 24"
          fill="none"
          stroke="var(--feedlog-empty-illustration-stroke)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M44 52h32M44 60h24M44 68h28"
          stroke="var(--feedlog-empty-illustration-muted)"
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    );
  }

  private handleUpvote = (
    event: CustomEvent<{
      issueId: string;
      currentUpvoted: boolean;
      currentCount: number;
    }>
  ) => {
    event.stopPropagation();
    this.feedlogUpvote.emit(event.detail);
  };

  private getVisibleIssues(): FeedlogIssueType[] {
    if (this.issues.length === 0) return [];
    if (this.limit == null || this.issues.length <= this.limit) {
      return this.issues;
    }
    const offset = (this.currentPage - 1) * this.limit;
    return this.issues.slice(offset, offset + this.limit);
  }

  private getPageNumbers(): (number | 'ellipsis')[] {
    if (this.limit == null) return [];
    const totalPages = Math.ceil(this.issues.length / this.limit);
    if (totalPages <= 1) return [];

    const toShow = new Set<number>([1, totalPages]);
    const start = Math.max(1, this.currentPage - 1);
    const end = Math.min(totalPages, this.currentPage + 1);
    for (let i = start; i <= end; i++) toShow.add(i);

    const sorted = Array.from(toShow).sort((a, b) => a - b);
    const result: (number | 'ellipsis')[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) result.push('ellipsis');
      result.push(sorted[i]!);
    }
    return result;
  }

  private goToPage(page: number) {
    const totalPages = this.limit != null ? Math.ceil(this.issues.length / this.limit) : 1;
    this.currentPage = Math.max(1, Math.min(page, totalPages));
  }

  private renderPagination() {
    if (this.limit == null || this.issues.length <= this.limit) return null;

    const totalPages = Math.ceil(this.issues.length / this.limit);
    const pageNumbers = this.getPageNumbers();

    return (
      <nav class="pagination" aria-label="Issues pagination">
        <button
          type="button"
          class="pagination-btn pagination-arrow"
          aria-label="Previous page"
          disabled={this.currentPage <= 1}
          onClick={() => this.goToPage(this.currentPage - 1)}
        >
          ‹
        </button>
        {pageNumbers.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={i} class="pagination-ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={i}
              type="button"
              class="pagination-btn"
              aria-current={p === this.currentPage ? 'page' : undefined}
              onClick={() => this.goToPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          class="pagination-btn pagination-arrow"
          aria-label="Next page"
          disabled={this.currentPage >= totalPages}
          onClick={() => this.goToPage(this.currentPage + 1)}
        >
          ›
        </button>
      </nav>
    );
  }

  render() {
    const visibleIssues = this.getVisibleIssues();

    return (
      <Host class={this.theme === 'dark' ? 'dark' : ''}>
        <div class="issues-list">
          {visibleIssues.length === 0 ? (
            <div class="empty-state">
              {this.emptyStateTitle && this.emptyStateMessage ? (
                <div class="empty-state-content">
                  {this.renderEmptyStateIllustration()}
                  <h2 class="empty-state-title">{this.emptyStateTitle}</h2>
                  <p class="empty-state-message">{this.emptyStateMessage}</p>
                </div>
              ) : (
                <p>No issues found</p>
              )}
            </div>
          ) : (
            visibleIssues.map(issue => (
              <feedlog-issue
                key={issue.id}
                issue={issue}
                issueUrl={this.getIssueUrl?.(issue) ?? undefined}
                theme={this.theme}
                onFeedlogUpvote={(e: CustomEvent) => this.handleUpvote(e)}
              />
            ))
          )}
        </div>
        {this.renderPagination()}
      </Host>
    );
  }
}
