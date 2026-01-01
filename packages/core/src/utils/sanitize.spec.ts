import {
  escapeHtml,
  sanitizeHtml,
  containsDangerousContent,
  stripHtmlTags,
  truncateText,
} from './sanitize';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<div>Hello & "World"</div>')).toBe(
        '&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;'
      );
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("It's a test")).toBe("It&#039;s a test");
    });

    it('should handle non-string input', () => {
      expect(escapeHtml(null as unknown as string)).toBe('');
      expect(escapeHtml(undefined as unknown as string)).toBe('');
    });

    it('should not escape already-escaped content', () => {
      // This is expected behavior - it will double-escape
      const escaped = escapeHtml('&lt;div&gt;');
      expect(escaped).toBe('&amp;lt;div&amp;gt;');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const dirty = '<div>Hello<script>alert("xss")</script>World</div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<script');
      expect(clean).not.toContain('alert');
    });

    it('should remove event handlers', () => {
      const dirty = '<button onclick="alert(\'xss\')">Click me</button>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('onclick');
    });

    it('should remove iframe tags', () => {
      const dirty = '<div><iframe src="evil.com"></iframe></div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<iframe');
    });

    it('should remove style tags', () => {
      const dirty = '<style>body { display: none; }</style><div>Content</div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<style');
    });

    it('should remove embed tags', () => {
      const dirty = '<div><embed src="evil.swf"></div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<embed');
    });

    it('should remove object tags', () => {
      const dirty = '<object data="evil.swf"></object>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<object');
    });

    it('should remove javascript protocol', () => {
      const dirty = '<a href="javascript:alert(\'xss\')">Click</a>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('javascript:');
    });

    it('should allow safe HTML', () => {
      const safe = '<div><p>This is <strong>safe</strong> HTML</p></div>';
      const clean = sanitizeHtml(safe);
      expect(clean).toContain('<div>');
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
    });

    it('should handle non-string input', () => {
      expect(sanitizeHtml(null as unknown as string)).toBe('');
      expect(sanitizeHtml(undefined as unknown as string)).toBe('');
    });

    it('should handle multiple event handlers', () => {
      const dirty =
        '<div onmouseover="alert(1)" onload="alert(2)" onclick="alert(3)">Bad</div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('onmouseover');
      expect(clean).not.toContain('onload');
      expect(clean).not.toContain('onclick');
    });
  });

  describe('containsDangerousContent', () => {
    it('should detect script tags', () => {
      expect(containsDangerousContent('<script>alert("xss")</script>')).toBe(true);
      expect(containsDangerousContent('<SCRIPT>alert("xss")</SCRIPT>')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(containsDangerousContent('onclick="alert()"')).toBe(true);
      expect(containsDangerousContent('onmouseover="bad()"')).toBe(true);
    });

    it('should detect iframe tags', () => {
      expect(containsDangerousContent('<iframe src="evil.com"></iframe>')).toBe(true);
    });

    it('should detect javascript protocol', () => {
      expect(containsDangerousContent('javascript:alert("xss")')).toBe(true);
    });

    it('should allow safe content', () => {
      expect(containsDangerousContent('<p>This is safe</p>')).toBe(false);
      expect(containsDangerousContent('Just plain text')).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(containsDangerousContent(null as unknown as string)).toBe(false);
      expect(containsDangerousContent(undefined as unknown as string)).toBe(false);
    });
  });

  describe('stripHtmlTags', () => {
    it('should remove all HTML tags', () => {
      expect(stripHtmlTags('<div><p>Hello <strong>World</strong></p></div>')).toBe(
        'Hello World'
      );
    });

    it('should handle self-closing tags', () => {
      expect(stripHtmlTags('Hello<br/>World')).toBe('HelloWorld');
      expect(stripHtmlTags('Image: <img src="test.jpg" />')).toBe('Image: ');
    });

    it('should handle attributes with > characters', () => {
      expect(stripHtmlTags('<div data-value="a > b">Content</div>')).toBe('Content');
    });

    it('should handle non-string input', () => {
      expect(stripHtmlTags(null as unknown as string)).toBe('');
      expect(stripHtmlTags(undefined as unknown as string)).toBe('');
    });

    it('should handle plain text', () => {
      expect(stripHtmlTags('Just plain text')).toBe('Just plain text');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + "..."
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncateText(text, 10)).toBe('Short');
    });

    it('should handle exact length', () => {
      const text = 'Exactly 20 characters!';
      const result = truncateText(text, 20);
      expect(result).toBe('Exactly 20...');
    });

    it('should handle non-string input', () => {
      expect(truncateText(null as unknown as string, 10)).toBe('');
      expect(truncateText(undefined as unknown as string, 10)).toBe('');
    });

    it('should not add ellipsis if text is shorter', () => {
      const text = 'Short';
      const result = truncateText(text, 20);
      expect(result).not.toContain('...');
    });

    it('should trim whitespace before adding ellipsis', () => {
      const text = 'This is a very long text';
      const result = truncateText(text, 10);
      // Should trim the space before adding ellipsis
      expect(result).toBe('This is a...');
    });
  });
});

