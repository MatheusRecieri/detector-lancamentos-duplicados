// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import { defineConfig, globalIgnores } from 'eslint/config'
// import { plugin } from 'postcss'

// export default defineConfig([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{js,jsx}'],
//     extends: [
//       js.configs.recommended,
//       reactHooks.configs['recommended-latest'],
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 'latest',
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//       plugins: ['react', 'prettier']
//     },
//     rules: {
//       'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
//       'prettier/prettier': 'error',
//       'react/react-in-jsx-scope': 'off'
//     },
//   },
// ])
// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import babelParser from '@babel/eslint-parser';

export default [
  // Config padrão JS do ESLint
  js.configs.recommended,

  // Config React
  pluginReact.configs.flat.recommended,

  // Config personalizada do projeto
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ['@babel/preset-react'] },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      'react-hooks': reactHooksPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier como erro
      'prettier/prettier': 'error',
      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': 0,

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JS padrão
      semi: ['error', 'always'],
      'prefer-const': ['error'],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
