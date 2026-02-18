import React from 'react';
import { createComponent } from './utils';

// Manual React wrappers for web components to avoid Stencil generation issues

export const FeedlogBadge = createComponent({
  tagName: 'feedlog-badge',
  elementClass: HTMLElement,
  react: React,
  events: {},
}) as any;

export const FeedlogButton = createComponent({
  tagName: 'feedlog-button',
  elementClass: HTMLElement,
  react: React,
  events: {
    feedlogClick: 'feedlogClick',
  },
}) as any;

export const FeedlogCard = createComponent({
  tagName: 'feedlog-card',
  elementClass: HTMLElement,
  react: React,
  events: {},
}) as any;

export const FeedlogIssues = createComponent({
  tagName: 'feedlog-issues',
  elementClass: HTMLElement,
  react: React,
  events: {
    feedlogUpvote: 'feedlogUpvote',
  },
}) as any;

export const FeedlogIssuesClient = createComponent({
  tagName: 'feedlog-issues-client',
  elementClass: HTMLElement,
  react: React,
  events: {},
}) as any;

export const FeedlogIssuesList = createComponent({
  tagName: 'feedlog-issues-list',
  elementClass: HTMLElement,
  react: React,
  events: {},
}) as any;