const moduleAlias = require('module-alias');
const findRoot = require('find-root');

const {
  node: baseEslint,
  getCodeEditorTypescriptEslintConfig,
} = require('@repo/eslint-base-isolated/eslint-config');
/**
 * We don't want to install eslint locally since we execute eslint from @repo/eslint-base-isolated,
 * so we want to alias it
 */
moduleAlias.addAliases({
  eslint: `${findRoot(require.resolve('@repo/eslint-base-isolated/package.json'))}/node_modules/eslint`,
});
const { configs } = require('eslint-plugin-jest');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  ...getCodeEditorTypescriptEslintConfig(__dirname),
  {
    languageOptions: configs['flat/recommended'].languageOptions,
    files: ['src/test/*'],
  },
];
