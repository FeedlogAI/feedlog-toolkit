# feedlog-issues-list

<!-- Auto Generated Below -->

## Overview

Feedlog Issues List Component

A component for displaying a list of GitHub issues with support for bugs and enhancements.

## Properties

| Property      | Attribute | Description                                                                          | Type                                                                  | Default     |
| ------------- | --------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------- |
| `getIssueUrl` | --        | Optional callback to resolve GitHub issue URL when githubIssueLink is not available. | `((issue: FeedlogIssue) => string \| null \| undefined) \| undefined` | `undefined` |
| `issues`      | --        | Array of issues to display                                                           | `FeedlogIssue[]`                                                      | `[]`        |
| `theme`       | `theme`   | Theme variant: 'light' or 'dark'                                                     | `"dark" \| "light"`                                                   | `'light'`   |

## Events

| Event           | Description                      | Type                                                                               |
| --------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| `feedlogUpvote` | Emitted when an issue is upvoted | `CustomEvent<{ issueId: string; currentUpvoted: boolean; currentCount: number; }>` |

## Dependencies

### Depends on

- [feedlog-issue](../feedlog-issue)

### Graph

```mermaid
graph TD;
  feedlog-issues-list --> feedlog-issue
  feedlog-issue --> feedlog-badge
  style feedlog-issues-list fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
