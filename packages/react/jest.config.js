module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts', '**/__tests__/**/?(*.)+(spec|test).tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/stencil-generated/**/*',
    '!src/**/__tests__/**/*',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  modulePaths: ['<rootDir>/../../node_modules'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@feedlog-ai/webcomponents/dist/components/.*$':
      '<rootDir>/src/__tests__/mocks/custom-elements.js',
    '^@feedlog-ai/webcomponents/loader$': '<rootDir>/src/__tests__/mocks/loader.js',
    '^@feedlog-ai/webcomponents$': '<rootDir>/src/__tests__/mocks/webcomponents.js',
  },
};
