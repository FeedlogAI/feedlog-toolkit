/**
 * Strips Stencil SSR hydration annotations from feedlog custom elements before the
 * HTML is sent to the browser.
 *
 * defineStencilSSRComponent (from @stencil/vue-output-target) renders components
 * server-side with DSD and adds Stencil-specific metadata that Vue's client-side
 * defineContainer does not produce:
 *   - s-id / c-id attributes  (Stencil component identifiers)
 *   - class="sc-feedlog-*-h hydrated"  (Stencil host element classes)
 *   - <!--r.N--> / <!--/--> comment nodes  (slot anchors)
 *   - <!--[--> / <!--]--> comment nodes    (Vue fragment markers in server output)
 *
 * When Vue hydrates, it compares the server DOM with what defineContainer renders
 * (<feedlog-badge variant="..."> with no extra attrs) and reports mismatches.
 * Stripping the Stencil-specific additions here makes the two representations
 * match. The DSD <template shadowrootmode="open"> is preserved so the Shadow DOM
 * is available from first paint.
 */
export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('render:html', html => {
    const strip = (s: string) => {
      const withoutStencilAttrs = s
        .replace(/\s+s-id="[^"]*"/g, '')
        .replace(/\s+c-id="[^"]*"/g, '')
        .replace(/\s+s-cr="[^"]*"/g, '')
        .replace(/<!--r\.\S+?-->/g, '')
        .replace(/<!--t\.\S+?-->/g, '')
        .replace(/<!--\/-->/g, '')
        .replace(
          /(<feedlog-[^>]*?)\s+class="([^"]*)"([^>]*?>)/g,
          (_match, before, classVal: string, after) => {
            const filtered = classVal
              .split(' ')
              .filter(c => c && !c.startsWith('sc-') && c !== 'hydrated')
              .join(' ');
            return filtered ? `${before} class="${filtered}"${after}` : `${before}${after}`;
          }
        );

      // Vue's server renderer wraps slot/light-dom children in fragment comment markers.
      // The client-side Stencil Vue container does not emit those markers, so Vue logs a
      // hydration mismatch unless we strip them from feedlog custom-element subtrees.
      return withoutStencilAttrs.replace(/<(feedlog-[a-z0-9-]+)([^>]*)>[\s\S]*?<\/\1>/g, block =>
        block.replace(/<!--\[-->/g, '').replace(/<!--\]-->/g, '')
      );
    };

    html.head = html.head.map(strip);
    html.body = html.body.map(strip);
  });
});
