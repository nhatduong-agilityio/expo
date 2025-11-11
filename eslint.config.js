const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactNativeA11y = require('eslint-plugin-react-native-a11y');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-native-a11y': reactNativeA11y,
    },
    rules: {
      ...reactNativeA11y.configs.all.rules,
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*'],
  },
]);
