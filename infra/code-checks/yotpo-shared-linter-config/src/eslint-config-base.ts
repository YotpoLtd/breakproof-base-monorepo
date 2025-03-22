import * as path from 'node:path';

// @ts-expect-error TS thinks that we can't consume ES module but we can
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { Linter } from 'eslint';
// @ts-expect-error package has no types
import * as eslintImportPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// @ts-expect-error package has no types
import eslintSimpleImportSortPlugin from 'eslint-plugin-simple-import-sort';

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

const jsLegacyConfig: Linter.Config = {
  // Start with a sensible set of rules
  extends: ['eslint:recommended', 'plugin:eslint-comments/recommended'],
  plugins: ['unicorn', 'sonarjs', 'promise'],
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
  overrides: [
    {
      files: ['**/*.tsx'],
      env: {
        browser: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        ...getNamingConventionRules(true),
      },
    },
    /**
     * CJS as a file type is forcing commonjs
     */
    {
      files: ['**/*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};

/**
 * This is called `tsLegacyConfig` because we still use the older eslint config
 * format for it (not the flat format).
 *
 * The new typescript eslint plugin is also published uner `typescript-eslint`,
 * and not under `@typescript-eslint/*`
 */
const tsLegacyConfig: Linter.Config = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    /**
     * Defining default options: `tsconfigRootDir` and `project` used by `typescript`
     *
     * It's expected that each package will call `getTypescriptProjectOverride()` to
     * explicitly specify the correct values, but these are here as meaningful default
     */
    tsconfigRootDir: process.cwd(),
    project: [path.join(process.cwd(), 'tsconfig.json')],

    /**
     * Don't output warnings if the package uses `typescript` version
     * which is not supported by the eslint plugin
     */
    warnOnUnsupportedTypeScriptVersion: false,
  },

  rules: {
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],

    /**
     * Disable the default check for `no-throw-literal` and enable
     * TypeScript-specific `@typescript-eslint/no-throw-literal`
     */
    'no-throw-literal': 'off',
    '@typescript-eslint/no-throw-literal': 'error',
    /**
     * Disable the default check for `no-unused-vars` and enable
     * TypeScript-specific `@typescript-eslint/no-unused-vars`
     */
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': sharedConfig['no-unused-vars'],

    '@typescript-eslint/no-unsafe-assignment': 'error',
    ...getNamingConventionRules(),
  },
};

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config: EslintConfig = [
  ...compat.config(jsLegacyConfig),
  {
    // ignore auto-generated files
    ignores: ['package-lock.json', 'pnpm-lock.yaml', 'dist/**'],
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- no types
      import: eslintImportPlugin,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- no types
      'simple-import-sort': eslintSimpleImportSortPlugin,
    },
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
      // not every year / version is present:
      // https://github.com/eslint/eslint/issues/15580#issuecomment-1030878719
      ecmaVersion: 2022,
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
  ...compat.config(tsLegacyConfig).map((config) => ({
    ...config,
    files: ['**/*.{ts,mts,tsx}'],
  })),
  {
    ...nodeGlobals,
    /**
     * This pattern matches files with the listed extensions and located
     * only at the project root <project>/
     *
     * Those files are assumed to be setup/config which might require default exports
     */
    files: ['*.{ts,mts,js,cjs,mjs}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];

export = config;
