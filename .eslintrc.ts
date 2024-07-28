module.exports = {
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
      'eqeqeq': 'error'
    }
  }