module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'jest --silent --passWithNoTests',
    'expo lint',
  ],
};
