const {
  getPackageAbsoluteDir,
} = require('@repo/circular-dependency-workaround');

const { node: baseEslint } = require(
  `${getPackageAbsoluteDir('@repo/eslint-base-isolated')}/lib/eslint-config`,
);

/** @type {import('../../code-checks/eslint-base-isolated/lib/types').EslintConfig} */
module.exports = [...baseEslint];
