module.exports = {
  '*.{js,jsx}': [
    'prettier --write',
    'jest --bail --findRelatedTests --silent --passWithNoTests',
    'expo lint',
  ],
  '*.{ts,tsx}': [
    'prettier --write',
    () => 'tsc --noEmit --skipLibCheck',
    'jest --bail --findRelatedTests --silent --passWithNoTests',
    'expo lint',
  ],
};
