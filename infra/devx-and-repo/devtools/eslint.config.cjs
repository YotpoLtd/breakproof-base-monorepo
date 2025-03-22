const {
  node: baseEslint,
  getCodeEditorTypescriptEslintConfig,
} = require('@repo/eslint-base-isolated/eslint-config');
const {
  nodeGlobals: nodeGlobalsEslintPartial,
} = require('@repo/eslint-base-isolated/eslint-partials');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  { files: ['scripts/*.{js,cjs,mjs}'], ...nodeGlobalsEslintPartial },
  ...getCodeEditorTypescriptEslintConfig(__dirname),
];
