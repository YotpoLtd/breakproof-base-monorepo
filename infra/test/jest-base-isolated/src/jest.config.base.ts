import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';

import { JestConfig } from './jest.types';

const CURRENT_WORKING_DIR = process.cwd();

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const config: JestConfig = {
  rootDir: CURRENT_WORKING_DIR,
  resolver: path.join(__dirname, 'jest.resolver.js'),
  // The test environment that will be used for testing
  testEnvironment: require.resolve('jest-environment-jsdom'),
  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/src/**/*.spec.{ts,tsx,js}'],
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  /**
   * Directories that we can directly import from
   */
  modulePaths: [
    /**
     * We rely on this to be here in our custom resolver (jest.resolver.js).
     * A.k.a. we first try to find a package in the root dir modules, and only
     * then check the other packages node_modules
     */
    '<rootDir>/node_modules',
  ],
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    /**
     * Mock static file imports with their respective file path
     */
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      path.join(__dirname, '__mocks__/mockFileExportToFilePath'),
    /**
     * Mock CSS module imports to an object with the keys that were accessed in
     * runtime
     */
    '\\.css$': require.resolve('identity-obj-proxy'),
  },
  // A map from regular expressions to transformers
  transform: {
    '\\.[jt]sx?$': [
      /**
       * We don't have babel-jest installed here since it will require other
       * babel stuff as peer dependencies, so we isolate it in
       * `@repo/babel-base-isolated`
       */
      fs.realpathSync(
        path.join(
          __dirname,
          '../node_modules/@repo/babel-base-isolated/node_modules/babel-jest',
        ),
      ),
      /**
       * Those can be any Babel options: https://babeljs.io/docs/options
       */
      { configFile: require.resolve('./babel.jest.config') },
    ],
  },
};

export default config;
