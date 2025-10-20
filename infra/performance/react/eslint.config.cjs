const {
  node: baseEslint,
  getCodeEditorTypescriptEslintConfig,
} = require('@repo/eslint-base-isolated/eslint-config');

/** @type {import('@repo/eslint-base-isolated/types').EslintConfig} */
module.exports = [
  ...baseEslint,
  ...getCodeEditorTypescriptEslintConfig(__dirname),
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        // Enum values
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        {
          // Boolean vars convention
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: [
            'is',
            'should',
            'has',
            'can',
            'did',
            'was',
            'will',
            'show',
          ].flatMap((prefix) => [prefix, `${prefix.toUpperCase()}_`]),
        },
      ],
    },
  },
];
