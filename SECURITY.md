# Security Audit and Best Practices

## Executive Summary

This document outlines the security considerations, vulnerabilities assessed, and best practices implemented in the Feedlog Toolkit to protect third-party integrations.

**Date:** December 31, 2025  
**Version:** 1.0.0  
**Scope:** @packages/core, @packages/webcomponents

---

## Security Overview

The Feedlog Toolkit is designed to be embedded in third-party websites and must operate securely in untrusted environments. The following security measures have been implemented:

### 1. XSS (Cross-Site Scripting) Protection

#### Vulnerability: HTML Content Injection
**Risk Level:** HIGH

**Affected Areas:**
- Issue titles and bodies from GitHub (user-supplied content)
- Repository names and owner information
- Any API response containing text fields

**Mitigation Implemented:**

1. **HTML Sanitization in Core SDK** (`packages/core/src/utils/sanitize.ts`)
   - Removes `<script>` tags and content
   - Removes all event handlers (`onclick`, `onerror`, `onmouseover`, etc.)
   - Removes dangerous tags (`<iframe>`, `<object>`, `<embed>`, `<style>`)
   - Removes `javascript:` protocol URLs
   - Removes unsafe `data:` URIs

2. **Shadow DOM Isolation**
   - All web components use Shadow DOM to prevent CSS and DOM attacks
   - Styles are scoped to component and cannot bleed out
   - External CSS cannot penetrate the component boundary

3. **Safe Rendering**
   - Uses `textContent` instead of `innerHTML` where possible
   - All dynamic content is rendered through component props
   - No use of `dangerouslySetInnerHTML` equivalent in Stencil

**Code Example:**
```typescript
// Issue title and body are automatically sanitized in the SDK
const issue: FeedlogIssue = {
  title: sanitizeHtml(rawTitle),  // Dangerous HTML removed
  body: sanitizeHtml(rawBody),     // Dangerous HTML removed
  // ... other fields
};
```

**Testing:**
- ✅ Sanitization utilities include tests for script injection
- ✅ Event handler removal tested
- ✅ iframe/object/embed tag removal tested
- ✅ Component tests verify malicious content doesn't render

**CSP Compatibility:**
The toolkit is compatible with strict Content Security Policies:
```
default-src 'none';
script-src 'self';
style-src 'self' 'unsafe-inline';
font-src 'self';
connect-src https://api.feedlog.app;
img-src 'self' https:;
frame-ancestors 'self';
```

---

### 2. API Key Security

#### Vulnerability: Key Exposure
**Risk Level:** CRITICAL

**Affected Areas:**
- API key passed as HTML attribute (`pk` prop)
- API key used in fetch Authorization header
- API key stored in component memory

**Mitigation Implemented:**

1. **Public API Keys Only**
   - The `pk` prop MUST use a public/restricted API key, not a secret key
   - Public keys have limited permissions (read-only for issues + upvote)
   - Secret keys should NEVER be exposed to the browser

2. **No Key Logging**
   - API keys are never logged to console
   - Error messages do not include the full API key
   - Errors sanitize sensitive information

3. **HTTPS-Only**
   - SDK enforces HTTPS when making API calls
   - Cookie is marked `secure: true` on server side
   - No credentials sent over unencrypted connections

4. **Memory Management**
   - API key is stored in private class field
   - Only accessible through controlled methods
   - Never exposed in responses

**Code Example:**
```typescript
// ❌ NEVER do this in production
const sdk = new FeedlogSDK({ apiKey: 'secret-key-...' });

// ✅ Always use restricted public API keys
const sdk = new FeedlogSDK({ apiKey: 'pk_live_...' });
```

**Implementation:**
```typescript
export class FeedlogSDK {
  private config: FeedlogSDKConfig;  // Private, not accessible from outside

  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      // API key is never logged or exposed
    };
  }
}
```

**Testing:**
- ✅ API key is stored privately
- ✅ API key not exposed in error messages
- ✅ Authorization header includes API key correctly
- ⚠️ **Manual verification required:** Ensure only public keys are used in production

---

### 3. Cookie Security and Anonymous User Tracking

#### Vulnerability: Cookie Hijacking / Tracking
**Risk Level:** MEDIUM

**Affected Areas:**
- Anonymous user ID tracking via cookies
- Cookie persistence across domains
- localStorage fallback mechanism

**Mitigation Implemented:**

1. **Server-Side Cookie Configuration**
   The server sets the `feedlog_anon_id` cookie with secure attributes:
   ```
   Set-Cookie: feedlog_anon_id=<uuid>; 
     Max-Age=31536000; 
     Path=/api; 
     SameSite=None; 
     Secure; 
     HttpOnly=false
   ```

2. **Client-Side Credential Handling**
   ```typescript
   // Always include credentials for cookie support
   const response = await fetch(url, {
     credentials: 'include',  // Required for cookies to work
     headers: this.getAuthHeaders(),
   });
   ```

3. **Cross-Origin Support**
   - `SameSite=None` allows cross-origin requests
   - Server configures CORS based on API key settings
   - Each domain must be explicitly allowed on the server

4. **Privacy Fallback**
   - If cookies are blocked (Safari ITP, privacy settings), the user gets a new anonymous ID per session
   - This is transparent to the user
   - localStorage fallback available but not used by default

**Security Notes:**
- Users cannot be directly identified (no personal information in cookie)
- Anonymous IDs are not reversible
- Only used for tracking upvote state per user
- No tracking across different websites

**Testing:**
- ✅ Fetch includes `credentials: 'include'`
- ✅ Cookie helper function implemented
- ⚠️ **Manual verification required:** Test on cross-origin domains

---

### 4. CORS (Cross-Origin Resource Sharing)

#### Vulnerability: Unauthorized Cross-Origin Requests
**Risk Level:** MEDIUM

**Affected Areas:**
- API requests from third-party domains
- Preflight OPTIONS requests
- Cookie inclusion in cross-origin requests

**Mitigation Implemented:**

1. **Server-Side CORS Configuration**
   - Server handles CORS preflight for all API endpoints
   - Allowed origins configured per API key
   - Credentials allowed only for configured origins

2. **Client-Side Implementation**
   ```typescript
   const response = await fetch(url, {
     credentials: 'include',  // Include cookies
     headers: {
       'Authorization': `Bearer ${this.config.apiKey}`,
       'Content-Type': 'application/json',
     },
   });
   ```

3. **Origin Configuration**
   Each API key must have allowed origins configured in the Feedlog dashboard:
   ```
   Allowed Origins:
   - https://example.com
   - https://subdomain.example.com
   - https://app.example.com
   ```

**Requirements for Integration:**
1. Configure API key with correct allowed origins
2. Use HTTPS for all requests
3. Include `credentials: 'include'` in fetch options

**Testing:**
- ✅ SDK includes credentials in requests
- ✅ Authorization header is properly set
- ⚠️ **Manual verification required:** Test CORS with actual third-party domains

---

### 5. Data Validation and Response Sanitization

#### Vulnerability: Malformed API Responses
**Risk Level:** MEDIUM

**Affected Areas:**
- API responses from backend
- Pagination cursors
- Issue object structure

**Mitigation Implemented:**

1. **Response Validation**
   All API responses are validated against expected types:
   ```typescript
   private validateIssuesResponse(data: unknown): FetchIssuesResponse {
     if (!Array.isArray(data.issues)) {
       throw new FeedlogValidationError('Invalid API response');
     }
     // Validate each issue...
   }
   ```

2. **Field-Level Validation**
   Each issue is validated for:
   - Required fields presence
   - Correct types (string, number, boolean)
   - Valid enums (type: 'bug' | 'enhancement')
   - Repository object structure

3. **Sanitization of Content**
   All string fields are sanitized to remove XSS payloads:
   ```typescript
   const sanitizedTitle = sanitizeHtml(String(issue.title));
   const sanitizedBody = sanitizeHtml(String(issue.body));
   ```

**Testing:**
- ✅ Invalid responses are rejected
- ✅ Missing required fields cause errors
- ✅ Malicious content is sanitized
- ✅ Type mismatches are caught

---

### 6. Input Validation

#### Vulnerability: Parameter Injection
**Risk Level:** LOW

**Affected Areas:**
- Repository ID parameters
- Cursor/pagination parameters
- Limit parameter

**Mitigation Implemented:**

1. **Query Parameter Encoding**
   ```typescript
   private buildIssuesUrl(params: FetchIssuesParams): string {
     const url = new URL(`${this.endpoint}/api/issues`);
     
     // Repository IDs are properly encoded
     for (const id of ids) {
       url.searchParams.append('repositoryIds', id);  // Auto-encoded
     }
     
     // Other parameters are also encoded
     if (params.cursor) {
       url.searchParams.set('cursor', params.cursor);  // Auto-encoded
     }
   }
   ```

2. **Type Checking**
   - TypeScript ensures correct parameter types
   - Runtime validation for API key and issue ID

3. **Cursor Opaqueness**
   - Pagination cursors are treated as opaque strings
   - Never parsed or constructed on the client
   - Passed directly to API

**Testing:**
- ✅ Special characters in parameters are encoded
- ✅ Type mismatches are caught at compile time
- ✅ Issue ID validation before API call

---

### 7. Rate Limiting

#### Vulnerability: Brute Force / DoS Attacks
**Risk Level:** MEDIUM

**Affected Areas:**
- Upvote endpoint spam
- Issue fetching spam

**Mitigation Implemented:**

1. **Server-Side Rate Limiting**
   - Server implements rate limiting (already in place)
   - Per-user/IP rate limits
   - Proper error responses (429 Too Many Requests)

2. **Client-Side Debouncing**
   - Button disabled during upvote request
   - Prevents rapid clicks on upvote button
   - Visual feedback while loading

3. **Rate Limiter Utility**
   ```typescript
   const limiter = createRateLimiter(10, 60000);  // 10 reqs per minute
   
   if (limiter.isAllowed()) {
     // Make API call
   } else {
     // Show rate limit error
   }
   ```

**Testing:**
- ✅ Rate limiter utility works correctly
- ✅ Button disabled during requests
- ⚠️ **Manual verification required:** Test server-side rate limiting

---

## Security Best Practices for Integrators

### For Website Administrators

1. **Use Only Public API Keys**
   - Never use secret API keys in browser JavaScript
   - Secret keys should only be used server-side

2. **Configure Allowed Origins**
   - Go to Feedlog dashboard
   - Add your domain(s) to the API key's allowed origins
   - Test with both root domain and subdomains if needed

3. **Use HTTPS**
   - All requests must be over HTTPS
   - HTTP requests will be rejected

4. **Content Security Policy (CSP)**
   Recommended CSP header:
   ```
   default-src 'none';
   script-src 'self';
   style-src 'self' 'unsafe-inline';
   connect-src https://api.feedlog.app https://api-staging.feedlog.app;
   font-src 'self';
   img-src 'self' https:;
   frame-ancestors 'self';
   ```

5. **Error Handling**
   - Don't expose API errors to users
   - Log errors securely on your backend
   - Show user-friendly error messages

### For Component Users

1. **Never Hardcode API Keys**
   ```javascript
   // ❌ Bad
   const issues = document.querySelector('feedlog-github-issues-client');
   issues.setAttribute('pk', 'pk_live_abc123');
   
   // ✅ Good - load from backend
   const apiKey = await fetch('/api/config').then(r => r.json()).then(d => d.feedlogKey);
   const issues = document.querySelector('feedlog-github-issues-client');
   issues.setAttribute('pk', apiKey);
   ```

2. **Handle Errors Gracefully**
   ```javascript
   element.addEventListener('feedlogError', (event) => {
     console.error('Feedlog error:', event.detail.error);
     // Show user-friendly message
   });
   ```

3. **Test on Target Domain**
   - Test component on your actual domain
   - Verify CORS configuration works
   - Check network tab in browser DevTools

---

## Known Limitations and Mitigations

### Limitation 1: Cookie Blocking
**Problem:** Safari ITP and privacy-focused browsers block third-party cookies

**Impact:** Anonymous user ID won't persist across sessions

**Mitigation:** Server sends new anonymous ID on each request (transparent to user)

---

### Limitation 2: CSP Restrictions
**Problem:** Very strict CSP policies may block component loading

**Impact:** Component may not render if script-src is restricted

**Mitigation:** Ensure `https://api.feedlog.app` is in connect-src allowlist

---

### Limitation 3: Ad Blocker Interference
**Problem:** Ad blockers may block requests to third-party APIs

**Impact:** Issue fetching may fail if user has ad blocker enabled

**Mitigation:** 
- Use domain that doesn't trigger ad blocker filters
- Show helpful error messages
- Consider fallback display

---

## Vulnerability Disclosure

If you discover a security vulnerability in the Feedlog Toolkit, please report it responsibly:

1. **Do NOT** create a public GitHub issue
2. **Email** security@feedlog.app with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your contact information

We will acknowledge reports within 48 hours and work on a fix.

---

## Dependencies and Supply Chain Security

### Core Dependencies
- **@stencil/core**: Web component framework
  - Regularly updated
  - Security-focused development
  - Active community

- **TypeScript**: Type safety
  - Catches many classes of bugs at compile time
  - No runtime dependency

### Dependency Audits
Run the following to check for known vulnerabilities:

```bash
npm audit --production
npm audit --all
```

Update vulnerable dependencies regularly:
```bash
npm update --depth 3
```

---

## Testing and Verification Checklist

- [ ] **XSS Protection**
  - [ ] Test script injection in titles
  - [ ] Test event handlers in body
  - [ ] Test iframe/object tags
  - [ ] Test javascript: protocol

- [ ] **API Key Security**
  - [ ] Verify only public keys used
  - [ ] Check error messages don't expose key
  - [ ] Verify HTTPS-only requests

- [ ] **CORS and Cookies**
  - [ ] Test on cross-origin domain
  - [ ] Verify cookies included in requests
  - [ ] Check CORS preflight succeeds
  - [ ] Test with cookies disabled

- [ ] **Data Validation**
  - [ ] Test with malformed API responses
  - [ ] Test with missing required fields
  - [ ] Test with wrong data types
  - [ ] Test with extremely large responses

- [ ] **Rate Limiting**
  - [ ] Test rapid upvote clicks
  - [ ] Test server rate limiting
  - [ ] Verify error handling

- [ ] **Component Integration**
  - [ ] Test on target domain(s)
  - [ ] Test with strict CSP policy
  - [ ] Test with ad blocker enabled
  - [ ] Test with Safari ITP enabled
  - [ ] Test on mobile browsers

---

## Security Version History

| Version | Date       | Changes |
|---------|-----------|---------|
| 1.0.0   | 2025-12-31 | Initial security audit |

---

## References and Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Component Security](https://www.w3.org/TR/webcomponents-usecases/)
- [Fetch API Security](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
- [Secure Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

---

## Document Metadata

- **Author:** Feedlog Security Team
- **Last Updated:** December 31, 2025
- **Next Review:** June 30, 2026
- **Classification:** Public

