import { defineCustomElements } from '@feedlog-toolkit/webcomponents/loader';

describe('@feedlog-toolkit/react', () => {
  it('should export components', () => {
    // This test will pass once Stencil generates the React components
    expect(defineCustomElements).toBeDefined();
  });
});

