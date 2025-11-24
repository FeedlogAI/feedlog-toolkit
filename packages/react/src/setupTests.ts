/**
 * Jest setup file for React tests
 */

// Mock window.customElements if needed
if (typeof window !== 'undefined' && !window.customElements) {
  (window as any).customElements = {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn(),
  };
}

