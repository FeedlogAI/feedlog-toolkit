/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@feedlog-toolkit/webcomponents';

import { defineCustomElements } from '@feedlog-toolkit/webcomponents/loader';

defineCustomElements();

export const FeedlogBadge = /*@__PURE__*/ defineContainer<JSX.FeedlogBadge>(
  'feedlog-badge',
  undefined,
  ['variant']
);

export const FeedlogButton = /*@__PURE__*/ defineContainer<JSX.FeedlogButton>(
  'feedlog-button',
  undefined,
  ['variant', 'size', 'disabled', 'type', 'feedlogClick']
);

export const FeedlogCard = /*@__PURE__*/ defineContainer<JSX.FeedlogCard>(
  'feedlog-card',
  undefined
);

export const FeedlogGithubIssues = /*@__PURE__*/ defineContainer<JSX.FeedlogGithubIssues>(
  'feedlog-github-issues',
  undefined,
  [
    'issues',
    'maxWidth',
    'theme',
    'loading',
    'error',
    'showThemeToggle',
    'hasMore',
    'isLoadingMore',
    'feedlogUpvote',
    'feedlogThemeChange',
    'feedlogLoadMore',
  ]
);

export const FeedlogGithubIssuesClient =
  /*@__PURE__*/ defineContainer<JSX.FeedlogGithubIssuesClient>(
    'feedlog-github-issues-client',
    undefined,
    [
      'repos',
      'type',
      'limit',
      'endpoint',
      'maxWidth',
      'theme',
      'showThemeToggle',
      'feedlogUpvote',
      'feedlogThemeChange',
      'feedlogError',
    ]
  );

export const FeedlogIssuesList = /*@__PURE__*/ defineContainer<JSX.FeedlogIssuesList>(
  'feedlog-issues-list',
  undefined,
  ['issues', 'theme', 'feedlogUpvote']
);
