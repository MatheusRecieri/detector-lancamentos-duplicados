import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extender config do Next.js
  ...compat.extends('next/core-web-vitals'),

  // Regras globais de arquivos JS/JSX
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**'],

    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },

    plugins: {
      react: pluginReact,
      // 'react-hooks': reactHooksPlugin,
      prettier: eslintPluginPrettier,
    },

    rules: {
      // Regras personalizadas
      'no-unused-vars': ['error'],
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off', // Next já importa React automaticamente
      '@next/next/no-page-custom-font': 'off'
    },
    globalIgnores([
      '.next/**',
    'out/',
    'build/***',
    'next-env.d.ts'
    ])

  settings: {
    react: { version: 'detect' },
  },
  },
];

export default eslintConfig;
