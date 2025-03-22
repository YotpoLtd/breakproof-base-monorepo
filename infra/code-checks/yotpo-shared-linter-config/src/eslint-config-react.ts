// @ts-expect-error TS thinks that we can't consume ES module but we can
import { FlatCompat } from '@eslint/eslintrc';

import eslintBrowserConfig from './eslint-config-browser';
import { EslintConfig } from './types';

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Base eslint configuration that combines the browser-specific eslint base config
 * + some react-specific rules
 */
const config: EslintConfig = [
  ...eslintBrowserConfig,
  {
    settings: {
      // we can't have this setting only for specific file type since once the eslint
      // react plugin is enabled it will perform react version check in any file type
      // regardless override pattern
      react: {
        version: 'detect',
      },
    },
  },
  ...compat.config({
    extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  }),
  {
    rules: {
      /**
       * Some self-explanatory rules for React codebase
       */
      'react/jsx-pascal-case': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-no-bind': 'error',
      'react/self-closing-comp': 'error',

      /**
       * Disable PropTypes checking since we use TypeScript
       */
      'react/prop-types': 'off',

      /**
       * We are injecting React in every file, so no need to check for missing import
       */
      'react/react-in-jsx-scope': 'off',

      /**
       * We are using react-anonymous-display-name & react-display-name babel plugins
       * so this check is non-applicable.
       */
      'react/display-name': 'off',

      /**
       * @TODO: Create a wrapper package around url handling in React.
       *        Instead, of the those forbidden components, use custom ones.
       *        Most of the custom components will live in this company-wide package
       */
      'react/forbid-elements': ['off', { forbid: ['a', 'button', 'input'] }],
      'no-restricted-imports': [
        'off',
        {
          paths: [
            {
              name: 'react-router-dom',
              importNames: [
                'Link',
                'LinkProps',
                'Router',
                'useParams',
                'useSearchParams',
                'createBrowserRouter',
                'RouteObject',
                'RouterProvider',
              ],
              message: "Please use imports from '@repo/____' instead.",
            },
          ],
        },
      ],
    },
  },
];

export = config;
