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
    res.status(500).send(`<pre>SSR Error: ${err.message}</pre>`);
  }
});

app.listen(PORT, () => {
  console.log(`Webcomponent SSR example running at http://localhost:${PORT}`);
});
