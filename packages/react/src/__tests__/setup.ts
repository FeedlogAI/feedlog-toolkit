import '@testing-library/jest-dom';

// Mock window.customElements for web components
if (!window.customElements) {
  window.customElements = {} as any;
}


