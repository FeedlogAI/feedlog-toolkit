import React from 'react';

/**
 * SSR entry for `@feedlog-ai/react/ssr-components` (Badge, Button, Card only).
 * Import only these custom elements so the server bundle does not pull in
 * issues/DOMPurify code that references the browser global `self` (breaks Node SSR).
 * Other wrappers live in `./index` and load in Client Components.
 */
import '@feedlog-ai/core/ssr-globals';
import '@feedlog-ai/webcomponents/components/feedlog-badge';
import '@feedlog-ai/webcomponents/components/feedlog-button';
import '@feedlog-ai/webcomponents/components/feedlog-card';

export type { FeedlogIssue } from '@feedlog-ai/core';

export const FeedlogBadge = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { variant?: string }) =>
  React.createElement('feedlog-badge', props, children);

export const FeedlogButton = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  size?: string;
  variant?: string;
  disabled?: boolean;
  type?: string;
}) => React.createElement('feedlog-button', props, children);

export const FeedlogCard = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  collapsible?: boolean;
  embed?: boolean;
}) => React.createElement('feedlog-card', props, children);
