# Build with the top-level client (`@feedlog-ai/webcomponents`)

Use **`<feedlog-issues-client>`** when you want one element: it loads issues with your API key and handles upvotes internally.

## When to use

- Vanilla HTML or any framework that can render custom elements
- You do not need server-side fetch of the issues array before paint (see [BUILD_FEEDLOG_COMPOSABLE.md](./BUILD_FEEDLOG_COMPOSABLE.md) for that)

## Install

```bash
npm install @feedlog-ai/webcomponents
```

## Minimal example

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
    <feedlog-issues-client
      api-key="your-api-key"
      type="bug"
      limit="10"
      theme="light"
      max-width="42rem"
    >
    </feedlog-issues-client>

    <script type="module">
      const client = document.querySelector('feedlog-issues-client');
      client.addEventListener('feedlogUpvote', event => {
        console.log('Issue upvoted:', event.detail);
      });
      client.addEventListener('feedlogError', event => {
        console.error('Error:', event.detail);
      });
    </script>
  </body>
</html>
```

## Events

- **`feedlogUpvote`** — `{ issueId, upvoted, upvoteCount }`
- **`feedlogError`** — `{ error, code? }`

## See also

- [README](./README.md) — full package docs, playground, SSR notes
- [Build Feedlog](../../README.md#build-feedlog) — other tiers
- [Customize Feedlog styling](../../docs/CUSTOMIZE_FEEDLOG_STYLING.md) — `--feedlog-*` variables
