const {
  node: baseEslint,
  getCodeEditorTypescriptEslintConfig,
} = require('@repo/eslint-base-isolated/eslint-config');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  ...getCodeEditorTypescriptEslintConfig(__dirname),
  {
    ignores: [
      '_templates/**/*.{ts,mts,json,json5}',
      '!_templates/**/prompt.ts',
      '!_templates/**/code-editor/**/*.ts',
    ],
  },
  {
    files: ['_templates/*/*/base-files/**/*'],
    // we create setup/config files which usually require default exports
    rules: {
      'import/no-default-export': 'off',
    },
  },
];
