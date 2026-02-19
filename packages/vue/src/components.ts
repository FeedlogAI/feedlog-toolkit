/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer, type StencilVueComponent } from '@stencil/vue-output-target/runtime';

import type { JSX } from '@feedlog-ai/webcomponents';

import { defineCustomElements } from '@feedlog-ai/webcomponents/loader';

defineCustomElements();

export const FeedlogBadge: StencilVueComponent<JSX.FeedlogBadge> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogBadge>('feedlog-badge', undefined, ['variant']);

export const FeedlogButton: StencilVueComponent<JSX.FeedlogButton> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogButton>(
    'feedlog-button',
    undefined,
    ['variant', 'size', 'disabled', 'type', 'feedlogClick'],
    ['feedlogClick']
  );

export const FeedlogCard: StencilVueComponent<JSX.FeedlogCard> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogCard>('feedlog-card', undefined);

export const FeedlogIssue: StencilVueComponent<JSX.FeedlogIssue> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogIssue>(
    'feedlog-issue',
    undefined,
    ['issue', 'issueUrl', 'theme', 'feedlogUpvote'],
    ['feedlogUpvote']
  );

export const FeedlogIssues: StencilVueComponent<JSX.FeedlogIssues> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogIssues>(
    'feedlog-issues',
    undefined,
    [
      'issues',
      'maxWidth',
      'limit',
      'theme',
      'heading',
      'subtitle',
      'emptyStateTitle',
      'emptyStateMessage',
      'loading',
      'error',
      'hasMore',
      'isLoadingMore',
      'getIssueUrl',
      'feedlogUpvote',
      'feedlogLoadMore',
    ],
    ['feedlogUpvote', 'feedlogLoadMore']
  );

export const FeedlogIssuesClient: StencilVueComponent<JSX.FeedlogIssuesClient> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogIssuesClient>(
    'feedlog-issues-client',
    undefined,
    [
      'apiKey',
      'type',
      'limit',
      'sortBy',
      'endpoint',
      'maxWidth',
      'theme',
      'heading',
      'subtitle',
      'emptyStateTitle',
      'emptyStateMessage',
      'getIssueUrl',
      'feedlogUpvote',
      'feedlogError',
    ],
    ['feedlogUpvote', 'feedlogError']
  );

export const FeedlogIssuesList: StencilVueComponent<JSX.FeedlogIssuesList> =
  /*@__PURE__*/ defineContainer<JSX.FeedlogIssuesList>(
    'feedlog-issues-list',
    undefined,
    [
      'issues',
      'limit',
      'theme',
      'getIssueUrl',
      'emptyStateTitle',
      'emptyStateMessage',
      'feedlogUpvote',
    ],
    ['feedlogUpvote']
  );
