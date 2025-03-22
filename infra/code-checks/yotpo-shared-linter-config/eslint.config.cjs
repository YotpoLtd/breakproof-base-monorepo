const {
  getPackageAbsoluteDir,
} = require('@repo/circular-dependency-workaround');

const { node: baseEslint } = require(
  `${getPackageAbsoluteDir('@repo/eslint-base-isolated')}/lib/eslint-config`,
);
const {
  getCodeEditorTypescriptEslintConfig,
} = require('./lib/ts-code-editor-helper');

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
