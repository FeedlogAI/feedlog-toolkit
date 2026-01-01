module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts', '**/__tests__/**/?(*.)+(spec|test).tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**/*'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 15,
      lines: 35,
      statements: 35,
    },
  },
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
    '^@feedlog-toolkit/webcomponents/loader$': '<rootDir>/src/__tests__/mocks/loader.js',
    '^@feedlog-toolkit/webcomponents$': '<rootDir>/src/__tests__/mocks/webcomponents.js',
  },
};
