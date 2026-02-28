/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import {
  defineContainer,
  defineStencilSSRComponent,
  type StencilVueComponent,
} from '@stencil/vue-output-target/runtime';

import type { JSX } from '@feedlog-ai/webcomponents';

import { defineCustomElements } from '@feedlog-ai/webcomponents/loader';

defineCustomElements();

export const FeedlogBadge: StencilVueComponent<JSX.FeedlogBadge> = /*@__PURE__*/ globalThis.window
  ? defineContainer<JSX.FeedlogBadge>('feedlog-badge', undefined, ['variant'])
  : defineStencilSSRComponent<JSX.FeedlogBadge>({
      tagName: 'feedlog-badge',
      hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
      props: {
        variant: [String, 'variant'],
      },
    });

export const FeedlogButton: StencilVueComponent<JSX.FeedlogButton> = /*@__PURE__*/ globalThis.window
  ? defineContainer<JSX.FeedlogButton>(
      'feedlog-button',
      undefined,
      ['variant', 'size', 'disabled', 'type', 'feedlogClick'],
      ['feedlogClick']
    )
  : defineStencilSSRComponent<JSX.FeedlogButton>({
      tagName: 'feedlog-button',
      hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
      props: {
        variant: [String, 'variant'],
        size: [String, 'size'],
        disabled: [Boolean, 'disabled'],
        type: [String, 'type'],
        onFeedlogClick: [Function],
      },
    });

export const FeedlogCard: StencilVueComponent<JSX.FeedlogCard> = /*@__PURE__*/ globalThis.window
  ? defineContainer<JSX.FeedlogCard>('feedlog-card', undefined)
  : defineStencilSSRComponent<JSX.FeedlogCard>({
      tagName: 'feedlog-card',
      hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
      props: {},
    });

export const FeedlogIssue: StencilVueComponent<JSX.FeedlogIssue> = /*@__PURE__*/ globalThis.window
  ? defineContainer<JSX.FeedlogIssue>(
      'feedlog-issue',
      undefined,
      ['issue', 'issueUrl', 'theme', 'feedlogUpvote'],
      ['feedlogUpvote']
    )
  : defineStencilSSRComponent<JSX.FeedlogIssue>({
      tagName: 'feedlog-issue',
      hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
      props: {
        issueUrl: [String, 'issue-url'],
        theme: [String, 'theme'],
        onFeedlogUpvote: [Function],
      },
    });

export const FeedlogIssues: StencilVueComponent<JSX.FeedlogIssues> = /*@__PURE__*/ globalThis.window
  ? defineContainer<JSX.FeedlogIssues>(
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
    )
  : defineStencilSSRComponent<JSX.FeedlogIssues>({
      tagName: 'feedlog-issues',
      hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
      props: {
        maxWidth: [String, 'max-width'],
        limit: [Number, 'limit'],
        theme: [String, 'theme'],
        heading: [String, 'heading'],
        subtitle: [String, 'subtitle'],
        emptyStateTitle: [String, 'empty-state-title'],
        emptyStateMessage: [String, 'empty-state-message'],
        loading: [Boolean, 'loading'],
        error: [String, 'error'],
        hasMore: [Boolean, 'has-more'],
        isLoadingMore: [Boolean, 'is-loading-more'],
        onFeedlogUpvote: [Function],
        onFeedlogLoadMore: [Function],
      },
    });

export const FeedlogIssuesClient: StencilVueComponent<JSX.FeedlogIssuesClient> =
  /*@__PURE__*/ globalThis.window
    ? defineContainer<JSX.FeedlogIssuesClient>(
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
      )
    : defineStencilSSRComponent<JSX.FeedlogIssuesClient>({
        tagName: 'feedlog-issues-client',
        hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
        props: {
          apiKey: [String, 'api-key'],
          type: [String, 'type'],
          limit: [Number, 'limit'],
          sortBy: [String, 'sort-by'],
          endpoint: [String, 'endpoint'],
          maxWidth: [String, 'max-width'],
          theme: [String, 'theme'],
          heading: [String, 'heading'],
          subtitle: [String, 'subtitle'],
          emptyStateTitle: [String, 'empty-state-title'],
          emptyStateMessage: [String, 'empty-state-message'],
          onFeedlogUpvote: [Function],
          onFeedlogError: [Function],
        },
      });

export const FeedlogIssuesList: StencilVueComponent<JSX.FeedlogIssuesList> =
  /*@__PURE__*/ globalThis.window
    ? defineContainer<JSX.FeedlogIssuesList>(
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
      )
    : defineStencilSSRComponent<JSX.FeedlogIssuesList>({
        tagName: 'feedlog-issues-list',
        hydrateModule: import('@feedlog-ai/webcomponents/hydrate'),
        props: {
          limit: [Number, 'limit'],
          theme: [String, 'theme'],
          emptyStateTitle: [String, 'empty-state-title'],
          emptyStateMessage: [String, 'empty-state-message'],
          onFeedlogUpvote: [Function],
        },
      });
