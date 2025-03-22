/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    require.resolve('@repo/eslint-base-isolated/eslintrc-precommit'),
    './.eslintrc.cjs',
  ],
};
