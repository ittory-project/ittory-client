import js from '@eslint/js';
import tanStackQuery from '@tanstack/eslint-plugin-query';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// NOTE: tseslint.config를 [] 에 감싸서 내보내면 CLI가 제대로 동작하지 않음
export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...tanStackQuery.configs['flat/recommended'], // @see https://tanstack.com/query/v5/docs/eslint/eslint-plugin-query#recommended-setup
    prettierRecommended,
  ],
  files: ['**/*.{js,jsx,ts,tsx}'],
  ignores: ['dist', 'node_modules', 'public'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    react,
    'unused-imports': unusedImports,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react/react-in-tsx-scope': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'no-multiple-empty-lines': 'error',
    'no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_' },
    ],
    eqeqeq: 'error',
  },
});
