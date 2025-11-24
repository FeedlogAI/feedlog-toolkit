module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!packages/**/*.d.ts',
    '!packages/**/*.spec.ts',
    '!packages/**/*.test.ts',
    '!packages/**/dist/**',
    '!packages/**/node_modules/**'
  ],
  moduleNameMapper: {
    '^@feedlog-toolkit/core$': '<rootDir>/packages/core/src',
    '^@feedlog-toolkit/core/(.*)$': '<rootDir>/packages/core/src/$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  }
};

