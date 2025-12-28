module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/projects/vult/src/e2e/',
    '<rootDir>/projects/vult-admin/src/e2e/'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  moduleNameMapper: {
    '^@vult/(.*)$': '<rootDir>/projects/vult/src/app/$1',
    '^@vult-admin/(.*)$': '<rootDir>/projects/vult-admin/src/app/$1',
    '^vult-components$': '<rootDir>/projects/vult-components/src/public-api.ts'
  },
  collectCoverageFrom: [
    'projects/**/src/app/**/*.ts',
    'projects/vult-components/src/lib/**/*.ts',
    '!projects/**/src/app/**/*.spec.ts',
    '!projects/vult-components/src/lib/**/*.spec.ts',
    '!projects/vult-components/src/lib/**/*.stories.ts',
    '!projects/**/src/app/**/index.ts',
    '!projects/**/src/e2e/**'
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs']
};
