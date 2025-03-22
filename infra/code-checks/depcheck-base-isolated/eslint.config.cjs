const {
  node: baseEslint,
  getCodeEditorTypescriptEslintConfig,
} = require('@repo/eslint-base-isolated/eslint-config');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  ...getCodeEditorTypescriptEslintConfig(__dirname),
  {
    rules: {
      // This package mainly exports base configs which commonly have a default export
      'import/no-default-export': 'off',
    },
  },
];
