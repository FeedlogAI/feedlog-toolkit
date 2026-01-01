import {
  escapeHtml,
  sanitizeHtml,
  containsDangerousContent,
  stripHtmlTags,
  truncateText,
} from '../utils/sanitize';

describe('escapeHtml() - Basic Escaping', () => {
  it('should escape ampersand', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  it('should escape less than', () => {
    expect(escapeHtml('5 < 10')).toBe('5 &lt; 10');
  });

  it('should escape greater than', () => {
    expect(escapeHtml('10 > 5')).toBe('10 &gt; 5');
  });

  it('should escape double quote', () => {
    expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;');
  });

  it('should escape single quote', () => {
    expect(escapeHtml("It's")).toBe('It&#039;s');
  });

  it('should escape all special characters', () => {
    expect(escapeHtml('< > & " \'')).toBe('&lt; &gt; &amp; &quot; &#039;');
  });

  it('should handle multiple occurrences', () => {
    expect(escapeHtml('& & & <')).toBe('&amp; &amp; &amp; &lt;');
  });

  it('should return empty string for null', () => {
    expect(escapeHtml(null as any)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(escapeHtml(undefined as any)).toBe('');
  });

  it('should return empty string for non-string input', () => {
    expect(escapeHtml(123 as any)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should re-escape already escaped content', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });
});

describe('sanitizeHtml() - Script Tag Removal', () => {
  it('should remove simple script tags', () => {
    expect(sanitizeHtml("<script>alert('xss')</script>")).toBe('');
  });

  it('should remove script tags with attributes', () => {
    expect(sanitizeHtml('<script src="evil.js"></script>')).toBe('');
  });

  it('should remove nested script tags', () => {
    expect(sanitizeHtml('<p><script>code</script></p>')).toBe('<p></p>');
  });

  it('should remove script between tags', () => {
    expect(sanitizeHtml('<p>text</p><script>code</script><p>more</p>')).toBe(
      '<p>text</p><p>more</p>'
    );
  });

  it('should remove multiple scripts', () => {
    expect(sanitizeHtml('<script>1</script><script>2</script>')).toBe('');
  });

  it('should be case-insensitive', () => {
    expect(sanitizeHtml('<SCRIPT>alert()</SCRIPT>')).toBe('');
  });

  it('should handle multiline scripts', () => {
    expect(sanitizeHtml('<script>\nalert()\n</script>')).toBe('');
  });
});

describe('sanitizeHtml() - Event Handler Removal', () => {
  it('should remove onclick attribute', () => {
    expect(sanitizeHtml('<button onclick="alert()">Click</button>')).toBe(
      '<button>Click</button>'
    );
  });

  it('should remove onload attribute', () => {
    expect(sanitizeHtml('<img onload="alert()" src="x">')).toBe('<img src="x">');
  });

  it('should remove onerror attribute', () => {
    expect(sanitizeHtml('<img onerror="alert()" src="x">')).toBe('<img src="x">');
  });

  it('should remove onmouseover attribute', () => {
    expect(sanitizeHtml('<div onmouseover="code()"></div>')).toBe('<div></div>');
  });

  it('should remove multiple handlers on same element', () => {
    expect(sanitizeHtml('<button onclick="a()" onmouseover="b()"></button>')).toBe(
      '<button></button>'
    );
  });

  it('should handle quoted event handlers', () => {
    const result = sanitizeHtml('<div onclick=\'alert("x")\' ></div>');
    expect(result).not.toContain('onclick');
  });

  it('should handle unquoted event handlers', () => {
    const result = sanitizeHtml('<div onclick=alert()></div>');
    expect(result).not.toContain('onclick');
  });

  it('should be case-insensitive', () => {
    const result = sanitizeHtml('<div ONCLICK="code()"></div>');
    expect(result).not.toContain('ONCLICK');
  });

  it('should handle handlers with spaces', () => {
    const result = sanitizeHtml('<div  onclick  =  "code()"  ></div>');
    expect(result).not.toContain('onclick');
  });
});

describe('sanitizeHtml() - Dangerous Tag Removal', () => {
  it('should remove iframe tags', () => {
    expect(sanitizeHtml('<iframe src="evil.com"></iframe>')).toBe('');
  });

  it('should remove style tags', () => {
    expect(sanitizeHtml('<style>body { color: red; }</style>')).toBe('');
  });

  it('should remove embed tags', () => {
    expect(sanitizeHtml('<embed src="evil.swf">')).toBe('');
  });

  it('should remove object tags', () => {
    const result = sanitizeHtml('<object data="evil.swf"></object>');
    expect(result).not.toContain('<object');
  });

  it('should remove multiple dangerous tags', () => {
    expect(sanitizeHtml('<iframe></iframe><style></style>')).toBe('');
  });
});

describe('sanitizeHtml() - Protocol Removal', () => {
  it('should remove javascript: protocol', () => {
    const result = sanitizeHtml('<a href="javascript:alert()">link</a>');
    expect(result).not.toContain('javascript:');
  });

  it('should remove data: protocol for non-image types', () => {
    const result = sanitizeHtml('<a href="data:text/html,<script>">link</a>');
    expect(result).not.toContain('data:text/html');
  });

  it('should preserve data: protocol for image types', () => {
    const html = '<img src="data:image/png;base64,ABC...">';
    const result = sanitizeHtml(html);
    expect(result).toContain('data:image/png');
  });
});

describe('sanitizeHtml() - Edge Cases', () => {
  it('should return empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(sanitizeHtml(null as any)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(sanitizeHtml(undefined as any)).toBe('');
  });

  it('should preserve plain text', () => {
    expect(sanitizeHtml('Hello World')).toBe('Hello World');
  });

  it('should preserve safe HTML', () => {
    expect(sanitizeHtml('<p>Hello <b>World</b></p>')).toBe('<p>Hello <b>World</b></p>');
  });

  it('should handle mixed safe and dangerous content', () => {
    const result = sanitizeHtml('<p onclick="x">Safe text</p>');
    expect(result).toContain('Safe text');
    expect(result).not.toContain('onclick');
  });
});

describe('containsDangerousContent() - Detection', () => {
  it('should detect script tags', () => {
    expect(containsDangerousContent('<script>alert()</script>')).toBe(true);
  });

  it('should detect event handlers', () => {
    expect(containsDangerousContent('<div onclick="code()"></div>')).toBe(true);
  });

  it('should detect iframe tags', () => {
    expect(containsDangerousContent('<iframe src="evil"></iframe>')).toBe(true);
  });

  it('should detect object tags', () => {
    expect(containsDangerousContent('<object data="x"></object>')).toBe(true);
  });

  it('should detect embed tags', () => {
    expect(containsDangerousContent('<embed src="x">')).toBe(true);
  });

  it('should detect javascript: protocol', () => {
    expect(containsDangerousContent('href="javascript:void(0)"')).toBe(true);
  });

  it('should return false for safe HTML', () => {
    expect(containsDangerousContent('<p>Hello</p>')).toBe(false);
  });

  it('should return false for plain text', () => {
    expect(containsDangerousContent('Hello World')).toBe(false);
  });

  it('should return false for safe links', () => {
    expect(containsDangerousContent('<a href="https://example.com">link</a>')).toBe(false);
  });

  it('should return false for null', () => {
    expect(containsDangerousContent(null as any)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(containsDangerousContent(undefined as any)).toBe(false);
  });

  it('should be case-insensitive', () => {
    expect(containsDangerousContent('<SCRIPT>')).toBe(true);
  });
});

describe('stripHtmlTags() - Complete Stripping', () => {
  it('should strip simple tags', () => {
    expect(stripHtmlTags('<p>Hello</p>')).toBe('Hello');
  });

  it('should strip nested tags', () => {
    expect(stripHtmlTags('<div><p>Hello <b>World</b></p></div>')).toBe('Hello World');
  });

  it('should strip multiple tags', () => {
    expect(stripHtmlTags('<p>Para1</p><p>Para2</p>')).toBe('Para1Para2');
  });

  it('should strip self-closing tags', () => {
    expect(stripHtmlTags('<img src="x"><br><hr>')).toBe('');
  });

  it('should strip tags with attributes', () => {
    expect(stripHtmlTags('<a href="link" class="btn">text</a>')).toBe('text');
  });

  it('should handle mixed content', () => {
    expect(stripHtmlTags('<p>Text <b>bold</b> <i>italic</i></p>')).toBe(
      'Text bold italic'
    );
  });

  it('should handle empty tags', () => {
    expect(stripHtmlTags('<div></div><p></p>')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(stripHtmlTags(null as any)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(stripHtmlTags(undefined as any)).toBe('');
  });

  it('should preserve plain text', () => {
    expect(stripHtmlTags('Hello World')).toBe('Hello World');
  });

  it('should preserve spaces', () => {
    expect(stripHtmlTags('<p>Hello   World</p>')).toBe('Hello   World');
  });
});

describe('truncateText() - Text Truncation', () => {
  it('should preserve text shorter than limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should preserve text equal to limit', () => {
    expect(truncateText('Hello World', 11)).toBe('Hello World');
  });

  it('should truncate text longer than limit', () => {
    const result = truncateText('Hello World', 5);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should truncate and trim whitespace', () => {
    const result = truncateText('Hello World', 8);
    expect(result.endsWith('...')).toBe(true);
  });

  it('should handle very long text', () => {
    const result = truncateText('The quick brown fox jumps over the lazy dog', 15);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(18);
  });

  it('should handle single character', () => {
    expect(truncateText('a', 1)).toBe('a');
  });

  it('should return empty string for empty input', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should return empty string for null', () => {
    expect(truncateText(null as any, 10)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(truncateText(undefined as any, 10)).toBe('');
  });

  it('should handle max length 0', () => {
    expect(truncateText('Hello', 0)).toBe('...');
  });

  it('should trim on truncation', () => {
    const result = truncateText('Hello  World', 6);
    expect(result).toBe('Hello...');
  });
});

