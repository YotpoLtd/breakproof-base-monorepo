import * as path from 'node:path';

import jestBaseConfig from './jest.config.base';
import { JestConfig } from './jest.types';

/**
 * The Jest configuration object, defining how Jest should run tests in the project.
 * This configuration is tailored for an Angular project, primarily targeting unit tests in `*.spec.ts` files
 * located in the `/src` directory.
 *
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const getJestConfig = (angularPresetDir: string): JestConfig => ({
  ...jestBaseConfig,

  /**
   * Specifies the Jest preset for Angular projects, ensuring proper handling of Angular-specific files
   * like templates and decorators.
   */
  preset: path.join(angularPresetDir, 'node_modules/jest-preset-angular'),

  /**
   * Defines the pattern for locating test files. Jest will only run tests matching this pattern.
   * In this configuration, it targets all `*.spec.ts` files under the `/src` directory.
   */
  testMatch: ['<rootDir>/src/**/*.spec.ts'],

  /**
   * Configures how different file types are transformed during the testing process.
   * The transformations are powered by `jest-preset-angular` to handle TypeScript, templates, and Angular-specific files.
   */
  transform: {
    /**
     * Matches files with extensions `.ts`, `.js`, `.mjs`, `.html`, and `.svg` and transforms them
     * using `jest-preset-angular`.
     */
    '^.+\\.(ts|js|mjs|html|svg)$': [
      path.join(angularPresetDir, 'node_modules/jest-preset-angular'),
      {
        /**
         * Path to the TypeScript configuration file for tests. It specifies compiler options for Jest.
         */
        tsconfig: '<rootDir>/tsconfig.spec.json',

        /**
         * Enables isolated modules, which transpile test files faster without full type-checking.
         */
        isolatedModules: true,
      },
    ],
  },

  /**
   * Specifies patterns to ignore during transformation.
   * Modules in the `node_modules` folder are ignored by default unless explicitly whitelisted.
   */
  transformIgnorePatterns: [
    /**
     * Excludes all `node_modules` from transformation, except the `flat` module.
     * The `flat` module is included because it may contain code requiring transformation.
     */
    '/node_modules/(?!flat)/',
  ],
});

export = { getJestConfig };
