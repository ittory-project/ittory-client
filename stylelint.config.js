import propertyGroups from 'stylelint-config-recess-order/groups';

/** @type {import('stylelint').Config} */
export default {
  rules: {
    'order/properties-order': propertyGroups.map((group) => ({
      ...group,
      emptyLineBefore: 'always',
      noEmptyLineBetween: true,
    })),
  },
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
