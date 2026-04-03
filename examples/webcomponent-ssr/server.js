import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { renderToString } from '@feedlog-ai/webcomponents/hydrate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const candidates = [
  path.join(__dirname, 'node_modules/@feedlog-ai/webcomponents/dist'),
  path.join(__dirname, '../../node_modules/@feedlog-ai/webcomponents/dist'),
  path.join(process.cwd(), 'node_modules/@feedlog-ai/webcomponents/dist'),
];
const webcomponentsPath = candidates.find(p => existsSync(p)) || candidates[0];
app.use('/feedlog', express.static(webcomponentsPath));

app.get('/', async (_req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Feedlog Web Components SSR</title>
</head>
<body>
  <main>
    <h1>Feedlog SSR Example</h1>
    <p>Components below are server-rendered with Declarative Shadow DOM:</p>
    <div class="components">
      <feedlog-badge variant="primary">SSR Badge</feedlog-badge>
      <feedlog-button variant="primary" size="md">SSR Button</feedlog-button>
      <feedlog-card>
        <h1 slot="header">SSR Card</h1>
        <p>This card content was rendered on the server.</p>
      </feedlog-card>
    </div>
  </main>
  <script type="module" src="/feedlog/feedlog-toolkit/feedlog-toolkit.esm.js"></script>
</body>
</html>`;

  try {
    const result = await renderToString(html, {
      serializeShadowRoot: 'declarative-shadow-dom',
      clientHydrateAnnotations: true,
      removeUnusedStyles: false,
    });

    res.send(result.html || html);
  } catch (err) {
    console.error('SSR error:', err);
    const message = err instanceof Error ? err.message : String(err);
    const safe = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    res.status(500).send(`<pre>SSR Error: ${safe}</pre>`);
  }
});

app.get('/pagination', async (_req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pagination Test</title>
</head>
<body>
  <div id="load-more-container">
    <feedlog-issues
      id="load-more-widget"
      pagination-type="load-more"
      heading="Load More Test"
    ></feedlog-issues>
  </div>
  <div id="prev-next-container">
    <feedlog-issues
      id="prev-next-widget"
      pagination-type="prev-next"
      heading="Prev/Next Test"
    ></feedlog-issues>
  </div>
  <script type="module" src="/feedlog/feedlog-toolkit/feedlog-toolkit.esm.js"></script>
  <script type="module">
    function makeIssue(id) {
      return {
        id: 'issue-' + id,
        githubIssueLink: null,
        title: 'Issue ' + id,
        body: 'Body ' + id,
        type: 'enhancement',
        status: 'open',
        pinnedAt: null,
        revision: 1,
        repository: { id: 'repo-1', name: 'test-repo', description: null },
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        upvoteCount: 0,
        hasUpvoted: false,
      };
    }

    function makeIssues(count, start) {
      return Array.from({ length: count }, (_, i) => makeIssue(start + i));
    }

    // Load-more widget setup
    const lm = document.getElementById('load-more-widget');
    lm.issues = makeIssues(3, 1);
    lm.hasMore = true;
    lm.limit = 3;

    let loadMorePage = 1;
    lm.addEventListener('feedlogLoadMore', () => {
      lm.isLoadingMore = true;
      setTimeout(() => {
        loadMorePage++;
        const start = (loadMorePage - 1) * 3 + 1;
        lm.issues = [...lm.issues, ...makeIssues(3, start)];
        lm.isLoadingMore = false;
        lm.hasMore = loadMorePage < 3;
      }, 1500);
    });

    // Prev/next widget setup
    const pn = document.getElementById('prev-next-widget');
    const allPages = [makeIssues(3, 1), makeIssues(3, 4), makeIssues(3, 7)];
    let currentPage = 0;

    function updatePrevNext() {
      pn.issues = allPages[currentPage];
      pn.hasPrev = currentPage > 0;
      pn.hasMore = currentPage < allPages.length - 1;
    }
    updatePrevNext();

    pn.addEventListener('feedlogPageChange', (e) => {
      if (e.detail.direction === 'next' && currentPage < allPages.length - 1) {
        currentPage++;
      } else if (e.detail.direction === 'prev' && currentPage > 0) {
        currentPage--;
      }
      updatePrevNext();
    });
  </script>
</body>
</html>`;

  try {
    const result = await renderToString(html, {
      serializeShadowRoot: 'declarative-shadow-dom',
      clientHydrateAnnotations: true,
      removeUnusedStyles: false,
    });
    res.send(result.html || html);
  } catch (err) {
    console.error('SSR error:', err);
    const message = err instanceof Error ? err.message : String(err);
    const safe = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    res.status(500).send(`<pre>SSR Error: ${safe}</pre>`);
  }
});

app.listen(PORT, () => {
  console.log(`Webcomponent SSR example running at http://localhost:${PORT}`);
});
