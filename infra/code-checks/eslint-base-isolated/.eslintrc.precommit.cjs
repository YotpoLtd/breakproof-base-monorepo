/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve('./eslintrc-precommit'), './.eslintrc.cjs'],
};
