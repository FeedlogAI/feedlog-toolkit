module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        // Disable TypeScript ESLint rules for JavaScript files
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['packages/webcomponents/src/**/*.tsx', 'packages/webcomponents/src/**/*.ts'],
      extends: ['plugin:stencil/recommended'],
      rules: {
        // Disable React rules that conflict with Stencil
        'react/react-in-jsx-scope': 'off',
        'react/no-unknown-property': 'off',
        'react/jsx-no-bind': 'off', // Already included in Stencil recommended but conflicts
        '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^h$' }],
        // Disable non-existent rule that might be cached
        'stencil/no-global-html-attribute-prop-names': 'off',
        // Allow any in web component source files for event handlers and error objects
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: [
        '**/__tests__/**/*.ts',
        '**/__tests__/**/*.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.stories.tsx',
      ],
      rules: {
        // Allow any in test files and stories for mocking and testing invalid inputs
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['packages/vue/src/vue-component-lib/**/*.ts', 'packages/*/src/utils/**/*.ts'],
      rules: {
        // Allow any in utility files that deal with dynamic props and external APIs
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
};
