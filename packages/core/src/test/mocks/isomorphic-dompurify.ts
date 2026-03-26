/**
 * Jest-only shim: same API as isomorphic-dompurify without pulling ESM-only transitive deps.
 * Production builds use the real isomorphic-dompurify package.
 */
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const purify = createDOMPurify(new JSDOM('').window as unknown as Window);

export default purify;
