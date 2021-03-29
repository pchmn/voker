module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '^@core/(.*)': '<rootDir>/src/app/core/$1',
    '^@shared/(.*)': '<rootDir>/src/app/shared/$1',
    '^@features/(.*)': '<rootDir>/src/app/features/$1',
    '^@config/(.*)': '<rootDir>/src/app/config/$1',
    '^@testing/(.*)': '<rootDir>/src/testing/$1',
    '\\.(css|scss|svg)$': 'identity-obj-proxy'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  collectCoverageFrom: [
    '**/*.tsx',
    '!**/*(index|test).tsx',
    '!<rootDir>/src/testing/**',
    '!<rootDir>/src/main.tsx'
  ]
};