/** @type {import('stylelint').Config} */
export default {
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      customSyntax: 'postcss-styled-syntax',
    },
    {
      files: ['**/*.css'],
    },
  ],
  extends: [
    // 'stylelint-config-standard',
    'stylelint-config-recess-order',
  ],
};
