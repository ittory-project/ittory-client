import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// NOTE: tseslint.config를 [] 에 감싸서 내보내면 CLI가 제대로 동작하지 않음
export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierRecommended,
  ],
  files: ['**/*.{ts,tsx}'],
  ignores: ['dist', 'node_modules', 'public'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    react,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react/react-in-tsx-scope': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-multiple-empty-lines': 'error',
    'no-unused-vars': 'error',
    eqeqeq: 'error',
  },
});
