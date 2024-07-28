import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended'
    ],
    ignorePatterns: ['dist', 'eslintrc.ts', 'node_modules'],
    parser: '@typescript-eslint/parser',
    rules: {
      'react-refresh/only-export-components': [
        'warn', { 'allowConstantExport': true }
      ],
      'no-multiple-empty-lines': 'error',
      'no-unused-vars': 'error',
      'react/react-in-tsx-scope': 'off',
      'react/react-in-jsx-scope': 'off',
      'eqeqeq': 'error'
    }
  }
];