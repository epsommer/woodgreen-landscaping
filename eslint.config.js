// eslint.config.js
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default {
	languageOptions: {
		parser: typescriptParser,
		parserOptions: {
			ecmaVersion: 2021,
			sourceType: 'module',
			jsxPragma: null,
		},
		globals: {
			...globals.browser,
			...globals.node,
		},
	},
	plugins: {
		react: eslintPluginReact,
		reactHooks: eslintPluginReactHooks,
		typescript: eslintPluginTypescript,
	},
	rules: {
		'react/react-in-jsx-scope': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
