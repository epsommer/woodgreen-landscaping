import { defineConfig } from 'eslint-define-config';
import babelParser from '@babel/eslint-parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default defineConfig([
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['react-app'],
        },
      },
      globals: {
        browser: 'readonly',
        es2021: 'readonly',
        node: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript, // Add TypeScript plugin
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // For React 17+ (no need to import React in every file)
      'no-unused-vars': 'warn', // Instead of turning it off, consider using 'warn'
      'react/prop-types': 'off', // If you're not using prop-types (e.g., if you're using TypeScript)
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'], // This section targets JavaScript/JSX files
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error', // Prevents JSX variables from being marked as unused
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);
