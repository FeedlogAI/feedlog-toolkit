import React from 'react';

// Import custom elements so the browser bundle still registers them for hydration.
import '@feedlog-ai/core/ssr-globals';
import '@feedlog-ai/webcomponents/components/feedlog-badge';
import '@feedlog-ai/webcomponents/components/feedlog-button';
import '@feedlog-ai/webcomponents/components/feedlog-card';
import '@feedlog-ai/webcomponents/components/feedlog-issue';
import '@feedlog-ai/webcomponents/components/feedlog-issues';
import '@feedlog-ai/webcomponents/components/feedlog-issues-client';
import '@feedlog-ai/webcomponents/components/feedlog-issues-list';

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

export const FeedlogCard = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
  React.createElement('feedlog-card', props, children);
