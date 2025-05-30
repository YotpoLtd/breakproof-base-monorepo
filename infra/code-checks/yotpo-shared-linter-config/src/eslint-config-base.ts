import * as path from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { ESLint, Linter } from 'eslint';
// @ts-expect-error package has no types
import * as eslintImportPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// @ts-expect-error missing types
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintSimpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import eslintPluginSonarJs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

import nodeGlobals from './partials/eslint-config-node-globals';
import { getImportOrderRules, getNamingConventionRules } from './rules';
import { EslintConfig } from './types';

/**
 * Rule configuration used for both the built-in eslint rule `no-unused-vars`
 * and the `@typescript-eslint/no-unused-vars`.
 */
const sharedConfig: Linter.RulesRecord = {
  'no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
};

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config: EslintConfig = [
  {
    // ignore auto-generated files
    ignores: ['package-lock.json', 'pnpm-lock.yaml', 'dist/**'],

    // default understanding for each file
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
      // not every year / version is present:
      // https://github.com/eslint/eslint/issues/15580#issuecomment-1030878719
      ecmaVersion: 2022,
    },
  },

  js.configs.recommended,

  // import order
  {
    plugins: {
      import: eslintImportPlugin as ESLint.Plugin,
      'simple-import-sort': eslintSimpleImportSortPlugin,
    },
    rules: {
      /**
       * Generic self-explanatory rules
       */
      'no-console': 'error',
      'no-self-compare': 'error',
      'no-unused-vars': sharedConfig['no-unused-vars'],
      'no-labels': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'import/no-self-import': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-default-export': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-absolute-path': 'error',
      /**
       * #consistency
       * Import statements (that are not dynamic) must be always at the top
       */
      'import/first': 'error',
      'import/no-empty-named-blocks': 'error',
      curly: 'error',
      /**
       * #bug-prevention
       * Prevents expressions like "string" + number which will implicitly convert the type
       */
      'no-implicit-coercion': 'error',
      'import/no-duplicates': 'error',
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      ...getImportOrderRules(),
    },
  },

  ...compat.config({
    extends: ['plugin:eslint-comments/recommended'],
    rules: {
      /**
       * #being-explicit
       * When developers disable eslint rules for part of the code/file using comments,
       * they need to provide a reason for that, so that others understand why
       */
      'eslint-comments/require-description': [
        'error',
        { ignore: ['eslint-enable'] },
      ],
    },
  }),

  /**
   * CJS as a file type is forcing commonjs
   */
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'script',
    },
  },
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
      sonarjs: eslintPluginSonarJs as ESLint.Plugin,
      promise: eslintPluginPromise as ESLint.Plugin,
    },
    rules: {
      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Use shorthands in regular expressions, e.g. /\d/ over /[0-9]/;
       */
      'unicorn/better-regex': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Array.isArray() instead of instanceof Array for more reliable array checking
       */
      'unicorn/no-instanceof-array': 'error',

      /**
       * Prevents if statements that could be part of an else if chain
       */
      'unicorn/no-lonely-if': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Use var === undefined instead of typeof, does the same but is easier to understand & type
       */
      'unicorn/no-typeof-undefined': 'error',

      /**
       * Removes unnecessary fallback values in spread elements
       */
      'unicorn/no-useless-fallback-in-spread': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Use Date.now() instead of new Date().getTime()
       */
      'unicorn/prefer-date-now': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Use export-from syntax instead of separate import/export statements
       */
      'unicorn/prefer-export-from': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Use KeyboardEvent.key instead of KeyboardEvent.keyCode for keyboard events
       */
      'unicorn/prefer-keyboard-event-key': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * #being-explicit
       * Use `node:*****` module names for built-in modules
       */
      'unicorn/prefer-node-protocol': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * #being-explicit
       * Prefer `Number.****` static methods, e.g. Number.parseInt() over parseInt()
       */
      'unicorn/prefer-number-properties': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * #being-explicit
       * Prefer RegExp.test() instead of String.match() for pattern testing
       */
      'unicorn/prefer-regexp-test': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * #being-explicit
       * Prefer string.slice() instead of string.substring()
       */
      'unicorn/prefer-string-slice': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * #being-explicit
       * Prefer trimStart()/trimEnd() instead of trimLeft()/trimRight()
       */
      'unicorn/prefer-string-trim-start-end': 'error',

      /**
       * #being-explicit
       * Requires else clause in if-else-if chains for better code coverage
       */
      'sonarjs/elseif-without-else': 'error',

      /**
       * #no-noise
       * Prevents boolean expressions that always evaluate to the same value
       */
      'sonarjs/no-gratuitous-expressions': 'error',

      /**
       * #readability
       * Prevents nesting promises
       */
      'promise/no-nesting': 'error',

      /**
       * #bug-prevention
       * Prevents multiple resolution of the same promise
       */
      'promise/no-multiple-resolved': 'error',

      /**
       * #consistency
       * #only-one-way-to-do-one-thing
       * Prevents expressions liek `new Promise.****(...)`, e.g. new Promise.race([p1, p2])
       */
      'promise/no-new-statics': 'error',

      /**
     * @TODO: Enable these rules when we have @repo/tscore package
       * Rules here are created with the help of the AST explorer and eslint docs:
       * 1. https://astexplorer.net/#/gist/214d5e94b1d39e5c76a9b4a867821e53/02a4993797ebd73093efa33a2aa9835f7ca3d12a
       * 2. https://eslint.org/docs/latest/extend/selectors
       * 3. https://eslint.org/docs/latest/rules/no-restricted-syntax
       */

      //'no-restricted-syntax': [
      //	'error',
      //	{
      //		selector: 'CatchClause > BlockStatement > :first-child:not(ThrowStatement,ExpressionStatement[expression.callee.name="assertCanHandle"])',
    //		message: 'Always add `assertCanHandle(..)` first in your catch {} expressions. Import `assertCanHandle` from `@repo/tscore`',
      //	},
      //	//{
      //	//	selector: 'Identifier[name="catch"]',
      //	//	message: 'Use try {} catch {} instead',
      //	//},
      //],
    },
  },
  ...(tseslint.config({
    files: ['**/*.{ts,mts,cts,tsx}'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: [path.join(process.cwd(), 'tsconfig.json')],
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreVoid: true },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unused-vars': sharedConfig['no-unused-vars'],
      ...getNamingConventionRules(),
    },
  }) as EslintConfig),
  {
    /**
     * This pattern matches files with the listed extensions and located
     * only at the project root <project>/
     *
     * Those files are assumed to be setup/config which might require default exports
     */
    files: ['*.{ts,mts,js,cjs,mjs}'],
    ...nodeGlobals,
    rules: {
      'import/no-default-export': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];

export = config;
