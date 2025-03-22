const {
  node: baseEslint,
  getCodeEditorTypescriptEslintConfig,
} = require('@repo/eslint-base-isolated/eslint-config');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  ...getCodeEditorTypescriptEslintConfig(__dirname),
  { ignores: ['lib'] },
];
