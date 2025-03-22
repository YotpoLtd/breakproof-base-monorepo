const {
  node: baseEslint,
} = require('@repo/eslint-base-isolated/eslint-config');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [...baseEslint];
