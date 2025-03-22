---
to: "<%- h.getPackageDir(name) %>/eslint.config.cjs"
---
const {
  browser: baseEslint
  <% if (hasTypescript) { %>
    , getCodeEditorTypescriptEslintConfig
  <% } %>
   } = require('@repo/eslint-base-isolated/eslint-config');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint
  <% if (hasTypescript) { %>
  , ...getCodeEditorTypescriptEslintConfig(__dirname)
  <% } %>
];
