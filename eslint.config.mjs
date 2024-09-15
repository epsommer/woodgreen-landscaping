// eslint.config.mjs
import { defineFlatConfig } from 'eslint-define-config';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import pluginJS from '@eslint/js';

export default defineFlatConfig([
	// Common configuration for JS, JSX, TS, and TSX files
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			parser: tsParser, // Reuse TypeScript parser for JS and TS files
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
				project: './tsconfig.json', // Ensure pointing to your TS config
				babelOptions: {
					presets: ['react-app'], // Babel preset for React apps
				},
			},
			globals: globals.browser, // Include browser globals
		},
		plugins: {
			react: pluginReact,
			'react-hooks': reactHooks,
			'@typescript-eslint': typescript,
			'jsx-a11y': jsxA11y,
		},
		extends: [
			'next',
			'next/core-web-vitals',
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:react/recommended',
			'plugin:jsx-a11y/recommended',
			pluginJS.configs.recommended, // Include basic JS recommendations
		],
		rules: {
			// Common rules for React and TypeScript
			'react/react-in-jsx-scope': 'off', // React 17+ does not require import in scope
			'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
			'react/prop-types': 'off', // Disable prop-types in favor of TypeScript types
			'react/jsx-uses-react': 'off', // Not needed with React 17+
			'react/jsx-uses-vars': 'off', // Not needed in modern React
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ varsIgnorePattern: '^_' }, // Ignore unused variables prefixed with '_'
			],
			'@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return types on modules
			...reactHooks.configs.recommended.rules, // React Hooks recommended rules
		},
	},
]);
