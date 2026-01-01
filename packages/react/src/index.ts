/**
 * React bindings for Feedlog Toolkit Web Components
 *
 * This package provides React components that wrap the Stencil web components.
 * Components are manually created to avoid Stencil generation issues.
 */

import React from 'react';
import { FeedlogIssue } from '@feedlog-toolkit/core';
import { defineCustomElements } from '@feedlog-toolkit/webcomponents/loader';

// Simple React wrappers for web components
export const FeedlogBadge = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { variant?: string }
>(({ children, ...props }, ref) =>
  React.createElement('feedlog-badge', { ...props, ref }, children)
);
FeedlogBadge.displayName = 'FeedlogBadge';

export const FeedlogButton = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    size?: string;
    variant?: string;
    disabled?: boolean;
    type?: string;
    onFeedlogClick?: (event: CustomEvent<MouseEvent>) => void;
  }
>(({ children, ...props }, ref) =>
  React.createElement('feedlog-button', { ...props, ref }, children)
);
FeedlogButton.displayName = 'FeedlogButton';

export const FeedlogCard = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => React.createElement('feedlog-card', { ...props, ref }, children)
);
FeedlogCard.displayName = 'FeedlogCard';

export const FeedlogGithubIssues = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    issues?: FeedlogIssue[];
    theme?: string;
    loading?: boolean;
    onFeedlogUpvote?: (
      event: CustomEvent<{
        issueId: string;
        currentUpvoted: boolean;
        currentCount: number;
      }>
    ) => void;
  }
>(({ children, ...props }, ref) =>
  React.createElement('feedlog-github-issues', { ...props, ref }, children)
);
FeedlogGithubIssues.displayName = 'FeedlogGithubIssues';

export const FeedlogGithubIssuesClient = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) =>
  React.createElement('feedlog-github-issues-client', { ...props, ref }, children)
);
FeedlogGithubIssuesClient.displayName = 'FeedlogGithubIssuesClient';

export const FeedlogIssuesList = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    issues?: FeedlogIssue[];
    onFeedlogUpvote?: (
      event: CustomEvent<{
        issueId: string;
        currentUpvoted: boolean;
        currentCount: number;
      }>
    ) => void;
  }
>(({ children, ...props }, ref) =>
  React.createElement('feedlog-issues-list', { ...props, ref }, children)
);
FeedlogIssuesList.displayName = 'FeedlogIssuesList';

// Auto-define custom elements when this module is imported
if (typeof window !== 'undefined') {
  defineCustomElements();
}
