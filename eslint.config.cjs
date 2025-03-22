/**
 * This config IS NOT RELATED to the projects in this repo.
 * It is only used for the repository top-level files which are outside any project,
 * e.g. `<repo root dir>/package.json` or ``<repo root dir>/README.md`
 */
const { node: baseEslint } = require('./infra/code-checks/eslint-base-isolated/lib/eslint-config');

/** @type {import('./infra/code-checks/eslint-base-isolated/lib/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  // limit to only files at the repository root
  { ignores: ['**/*', '!*.{js,cjs,mjs,md}'] }
];
