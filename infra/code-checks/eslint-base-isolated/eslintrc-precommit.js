/**
 * We only enable `eslint-plugin-diff` for pre-commit & CI since the plugin
 * has problems with code editors, and it doesn't show or hide errors correctly.
 *
 * @type {import('eslint').Linter.Config}
 * */
module.exports = require('eslint-plugin-diff').configs.diff;
