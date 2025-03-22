import { builtinModules } from 'node:module';

import { Linter } from 'eslint';

/**
 * Non-javascript extensions to use when making the import ordering rules
 */
const ASSETS_EXTENSIONS = ['svg', 'css', 'png', 'jpg', 'jpeg', 'gif'] as const;

/**
 * Converts `.` to `\.` in all passed strings
 */
const convertNamesToRegexUnionString = <T extends Array<string>>(
  names: T | Readonly<T>,
) => names.map((name) => name.replace(/\./g, '\\.')).join('|');

const BUILTIN_MODULES_REGEX_STRING =
  convertNamesToRegexUnionString(builtinModules);

/**
 * Generates eslint rule for ordering and grouping imports
 */
export const getImportOrderRules = (
  localPackagesNames: Array<string> = [],
): Linter.RulesRecord => {
  return {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // core-js must be first because it includes polyfills
          ['core-js/stable'],
          // built-in packages into node
          [
            `^(${BUILTIN_MODULES_REGEX_STRING})$`,
            `^node:`,
            `^(${BUILTIN_MODULES_REGEX_STRING})/`,
          ],
          // third-party packages
          [`^@?\\w`],
          // @yotpo* packages
          [`^@yotpo`],
          // @repo/* packages
          [`^@repo/`],
          // import aliases defined in the `imports` property of `package.json`
          [`^#`, ...localPackagesNames.map((pckgName) => `^${pckgName}(/.+)?`)],
          // relative imports
          ['^\\.'],
          // side-effect imports (e.g. import './something';)
          ['^\\u0000'],
          // asset imports (non-javascript imports)
          [`\\.(${ASSETS_EXTENSIONS.join('|')})$`],
        ],
      },
    ],
  };
};
/**
 * Generates eslint rule for TS naming convention
 */
export const getNamingConventionRules = (
  includeJSX = false,
): Linter.RulesRecord => ({
  '@typescript-eslint/naming-convention': [
    'error',
    // All type definitions
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
    // Enum values
    {
      selector: 'enumMember',
      format: ['UPPER_CASE'],
    },
    // Variables
    {
      // Rule for ReactContexts
      selector: 'variable',
      modifiers: ['const', 'global'],
      filter: {
        match: true,
        regex: '^[A-Z].*Context$',
      },
      format: ['PascalCase'],
    },
    {
      // Rule for dynamic React Components
      selector: ['variableLike', 'property', 'memberLike'],
      filter: {
        match: true,
        regex: '.*Component$',
      },
      format: ['PascalCase'],
    },
    {
      // Rule for top level functions and a case for react components
      selector: 'variable',
      modifiers: ['const', 'global'],
      format: [
        'camelCase',
        'PascalCase',
        /**
         * React components should start with capital letter and can be
         * dynamically assigned within functions
         * https://iq.js.org/questions/react/why-should-component-names-start-with-capital-letter
         */
        includeJSX && 'PascalCase',
      ].filter(Boolean),
      types: ['function'],
    },
    {
      // All top level vars with primitive types
      selector: 'variable',
      modifiers: ['const', 'global'],
      format: ['UPPER_CASE'],
      types: ['boolean', 'number', 'string'],
    },
    {
      // All other top level var
      selector: 'variable',
      modifiers: ['const', 'global'],
      format: ['camelCase', 'UPPER_CASE'],
    },
    {
      // Boolean vars convention
      selector: 'variable',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: ['is', 'should', 'has', 'can', 'did', 'was', 'will', 'show'],
    },
    {
      // Allow props to be named as constants
      selector: ['property'],
      leadingUnderscore: 'allow',
      format: ['camelCase', 'UPPER_CASE'],
    },
    {
      // In a literal objects do not enforce naming they could be named by third parties
      selector: ['objectLiteralProperty'],
      format: null,
    },
    {
      // All members should be camelCase
      selector: ['memberLike', 'variableLike'],
      leadingUnderscore: 'allow',
      format: ['camelCase'],
    },
  ],
});
