import prettier from 'eslint-config-prettier'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'

const gitignore_path = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default ts.config(
	includeIgnoreFile(gitignore_path),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variableLike',
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'parameter',
					modifiers: ['destructured'],
					format: null,
				},
				{
					selector: 'variable',
					modifiers: ['destructured'],
					format: null,
				},
			],
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					caughtErrorsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			eqeqeq: ['error', 'always'],
			'svelte/require-each-key': 'off', // Unnecessary each key probably has performance downside
		},
	},
)
