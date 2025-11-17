module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './jest.setup.ts',
    'react-native-unistyles/mocks',
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
    './unistyles.ts',
  ],
  collectCoverage: true,
  testMatch: ['**/__tests__/**/*-test.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.giga/'],
};
