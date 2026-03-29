# Composable changelog (`@feedlog-ai/webcomponents` + `@feedlog-ai/core`)

Fetch issues yourself with **`FeedlogSDK`**, then pass them into **`<feedlog-issues>`**. The element does not call the API; it only renders the list and emits upvote events.

## When to use

- You control **when and where** data loads (SSR hydrate, loaders, your own loading states)
- You need to set **`issues` as a property** (arrays cannot be passed as HTML attributes)

## Install

```bash
npm install @feedlog-ai/webcomponents @feedlog-ai/core
```

## Important: set `issues` on the element

Load the component bundle, then assign the array in JavaScript (arrays are not HTML attributes):

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="/node_modules/@feedlog-ai/webcomponents/dist/feedlog-toolkit/feedlog-toolkit.esm.js"
    ></script>
  </head>
  <body>
    <feedlog-issues id="changelog" theme="light" max-width="42rem"></feedlog-issues>

    <script type="module">
      import { FeedlogSDK } from '@feedlog-ai/core';

      const el = document.getElementById('changelog');
      const sdk = new FeedlogSDK({ apiKey: 'your-api-key' });

      const { issues } = await sdk.fetchIssues({ limit: 10 });
      el.issues = issues;

      el.addEventListener('feedlogUpvote', async event => {
        const { issueId } = event.detail;
        await sdk.toggleUpvote(issueId);
        const next = await sdk.fetchIssues({ limit: 10 });
        el.issues = next.issues;
      });

      el.addEventListener('feedlogLoadMore', async () => {
        // If you use pagination: fetch with cursor, append or replace issues
      });
    </script>
  </body>
</html>
```

## Pagination

If you set **`limit`** on `<feedlog-issues>` and supply more issues than that limit, the component can emit **`feedlogLoadMore`**. Combine with `FeedlogSDK.fetchIssues({ cursor })` using `pagination` from the previous response. See the [feedlog-issues component readme](./src/components/feedlog-issues/readme.md) for props (`has-more`, `is-loading-more`, etc.).

## Optional: issue URLs

If an issue has no `githubIssueLink`, you can provide **`getIssueUrl`** (property, function) on the element. See the [feedlog-issues readme](./src/components/feedlog-issues/readme.md).

## Styling

Theme **`feedlog-issues`** (or an ancestor) with `--feedlog-*` variables: [Customize Feedlog styling](../../docs/CUSTOMIZE_FEEDLOG_STYLING.md).

## See also

- [@feedlog-ai/core README](../core/README.md) — `fetchIssues`, `toggleUpvote`, types
- [Build Your Own Feedlog hub](../../docs/BUILD_YOUR_OWN_FEEDLOG.md)
