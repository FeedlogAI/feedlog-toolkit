/**
 * React bindings for Feedlog Toolkit Web Components
 *
 * This package provides React components that wrap the Stencil web components.
 * Components properly handle complex props (objects/arrays) by setting them
 * as DOM properties rather than HTML attributes.
 */

import React, { useEffect, useRef } from 'react';
import type { FeedlogIssue as FeedlogIssueType } from '@feedlog-ai/core';

// Import custom element components - each import auto-registers the component
// and its dependencies. This uses the dist-custom-elements output which works
// correctly with modern bundlers (Vite, webpack, etc.), unlike the lazy-loading
// defineCustomElements() approach that causes 404s in production builds.
import '@feedlog-ai/webcomponents/components/feedlog-github-issues-client';
import '@feedlog-ai/webcomponents/components/feedlog-github-issues';
import '@feedlog-ai/webcomponents/components/feedlog-issue';
import '@feedlog-ai/webcomponents/components/feedlog-issues-list';
import '@feedlog-ai/webcomponents/components/feedlog-badge';
import '@feedlog-ai/webcomponents/components/feedlog-button';
import '@feedlog-ai/webcomponents/components/feedlog-card';

// Re-export types for convenience
export type { FeedlogIssue } from '@feedlog-ai/core';

/**
 * Helper to merge refs
 */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}

/**
 * Helper to separate primitive props (strings, booleans, numbers) from complex props.
 * Primitive props can be passed as HTML attributes, complex props must be set as DOM properties.
 */
function separateProps(props: Record<string, unknown>): {
  primitiveProps: Record<string, unknown>;
  complexProps: Record<string, unknown>;
  eventProps: Record<string, unknown>;
} {
  const primitiveProps: Record<string, unknown> = {};
  const complexProps: Record<string, unknown> = {};
  const eventProps: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children' || key === 'ref' || key === 'style' || key === 'className') {
      primitiveProps[key] = value;
    } else if (key.startsWith('on') && key[2] === key[2].toUpperCase()) {
      // Event handlers
      eventProps[key] = value;
    } else {
      const type = typeof value;
      if (type === 'string' || type === 'boolean' || type === 'number' || value === undefined) {
        primitiveProps[key] = value;
      } else {
        // Objects, arrays, functions
        complexProps[key] = value;
      }
    }
  });

  return { primitiveProps, complexProps, eventProps };
}

/**
 * Hook to sync complex props and events to a web component element
 */
function useWebComponentProps(
  elementRef: React.RefObject<HTMLElement | null>,
  complexProps: Record<string, unknown>,
  eventProps: Record<string, unknown>
) {
  // Track registered event listeners for cleanup
  const eventListenersRef = useRef<Map<string, EventListener>>(new Map());

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set complex props as DOM properties
    Object.entries(complexProps).forEach(([key, value]) => {
      (element as unknown as Record<string, unknown>)[key] = value;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexProps]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const currentListeners = eventListenersRef.current;

    // Remove old listeners
    currentListeners.forEach((listener, eventName) => {
      element.removeEventListener(eventName, listener);
    });
    currentListeners.clear();

    // Add new listeners
    Object.entries(eventProps).forEach(([key, handler]) => {
      if (typeof handler === 'function') {
        // Convert onFeedlogUpvote -> feedlogUpvote
        const eventName = key.substring(2);
        const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
        const listener = handler as EventListener;
        element.addEventListener(eventNameLc, listener);
        currentListeners.set(eventNameLc, listener);
      }
    });

    return () => {
      currentListeners.forEach((listener, eventName) => {
        element.removeEventListener(eventName, listener);
      });
      currentListeners.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventProps]);
}

// Simple React wrappers for web components that only have primitive props
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
>(({ children, onFeedlogClick, ...props }, ref) => {
  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = internalRef.current;
    if (!element || !onFeedlogClick) return;

    const handler = onFeedlogClick as EventListener;
    element.addEventListener('feedlogClick', handler);
    return () => element.removeEventListener('feedlogClick', handler);
  }, [onFeedlogClick]);

  return React.createElement(
    'feedlog-button',
    { ...props, ref: mergeRefs(ref, internalRef) },
    children
  );
});
FeedlogButton.displayName = 'FeedlogButton';

export const FeedlogCard = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => React.createElement('feedlog-card', { ...props, ref }, children)
);
FeedlogCard.displayName = 'FeedlogCard';

export interface FeedlogGithubIssuesProps extends React.HTMLAttributes<HTMLElement> {
  issues?: FeedlogIssueType[];
  maxWidth?: string;
  theme?: 'light' | 'dark';
  heading?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onFeedlogUpvote?: (
    event: CustomEvent<{
      issueId: string;
      currentUpvoted: boolean;
      currentCount: number;
    }>
  ) => void;
  onFeedlogLoadMore?: (event: CustomEvent<void>) => void;
}

export const FeedlogGithubIssues = React.forwardRef<HTMLElement, FeedlogGithubIssuesProps>(
  ({ children, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const { primitiveProps, complexProps, eventProps } = separateProps(props);

    useWebComponentProps(internalRef, complexProps, eventProps);

    return React.createElement(
      'feedlog-github-issues',
      { ...primitiveProps, ref: mergeRefs(ref, internalRef) },
      children
    );
  }
);
FeedlogGithubIssues.displayName = 'FeedlogGithubIssues';

export interface FeedlogGithubIssuesClientProps extends React.HTMLAttributes<HTMLElement> {
  apiKey: string;
  endpoint?: string;
  type?: 'bug' | 'enhancement';
  limit?: number;
  maxWidth?: string;
  theme?: 'light' | 'dark';
  heading?: string;
  subtitle?: string;
  onFeedlogUpvote?: (
    event: CustomEvent<{
      issueId: string;
      upvoted: boolean;
      upvoteCount: number;
    }>
  ) => void;
  onFeedlogError?: (event: CustomEvent<{ error: string; code?: number }>) => void;
}

export const FeedlogGithubIssuesClient = React.forwardRef<
  HTMLElement,
  FeedlogGithubIssuesClientProps
>(({ children, ...props }, ref) => {
  const internalRef = useRef<HTMLElement>(null);
  const { primitiveProps, complexProps, eventProps } = separateProps(props);

  useWebComponentProps(internalRef, complexProps, eventProps);

  return React.createElement(
    'feedlog-github-issues-client',
    { ...primitiveProps, ref: mergeRefs(ref, internalRef) },
    children
  );
});
FeedlogGithubIssuesClient.displayName = 'FeedlogGithubIssuesClient';

export interface FeedlogIssuesListProps extends React.HTMLAttributes<HTMLElement> {
  issues?: FeedlogIssueType[];
  onFeedlogUpvote?: (
    event: CustomEvent<{
      issueId: string;
      currentUpvoted: boolean;
      currentCount: number;
    }>
  ) => void;
}

export const FeedlogIssuesList = React.forwardRef<HTMLElement, FeedlogIssuesListProps>(
  ({ children, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const { primitiveProps, complexProps, eventProps } = separateProps(props);

    useWebComponentProps(internalRef, complexProps, eventProps);

    return React.createElement(
      'feedlog-issues-list',
      { ...primitiveProps, ref: mergeRefs(ref, internalRef) },
      children
    );
  }
);
FeedlogIssuesList.displayName = 'FeedlogIssuesList';

export interface FeedlogIssueProps extends React.HTMLAttributes<HTMLElement> {
  issue: FeedlogIssueType;
  theme?: 'light' | 'dark';
  onFeedlogUpvote?: (
    event: CustomEvent<{
      issueId: string;
      currentUpvoted: boolean;
      currentCount: number;
    }>
  ) => void;
}

export const FeedlogIssueComponent = React.forwardRef<HTMLElement, FeedlogIssueProps>(
  ({ children, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const { primitiveProps, complexProps, eventProps } = separateProps(props);

    useWebComponentProps(internalRef, complexProps, eventProps);

    return React.createElement(
      'feedlog-issue',
      { ...primitiveProps, ref: mergeRefs(ref, internalRef) },
      children
    );
  }
);
FeedlogIssueComponent.displayName = 'FeedlogIssue';

// Custom elements are auto-defined via the import of '@feedlog-ai/webcomponents/custom-elements' above.
// No need for defineCustomElements() - the dist-custom-elements bundle handles registration
// automatically when imported, and works correctly with modern bundlers like Vite.
