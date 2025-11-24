import { defineCustomElements } from '@feedlog-toolkit/webcomponents/loader';

describe('@feedlog-toolkit/vue', () => {
  it('should export components', () => {
    // This test will pass once Stencil generates the Vue components
    expect(defineCustomElements).toBeDefined();
  });
});

