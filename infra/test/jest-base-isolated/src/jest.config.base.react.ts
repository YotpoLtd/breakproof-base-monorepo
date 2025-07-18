import * as path from 'node:path';

import jestBaseConfig, {
  JEST_BABEL_TRANSFORM_FILE_PATTERN,
} from './jest.config.base';
import { JestConfig } from './jest.types';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const config: JestConfig = {
  ...jestBaseConfig,

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    ...jestBaseConfig.moduleNameMapper,
    /**
     * Mock imports of SVG as 'div' since in reality webpack will transform them
     * to React components
     */
    '\\.svg': path.join(__dirname, '__mocks__/mockFileAsDivString'),
  },
  transform: {
    ...jestBaseConfig.transform,
    [JEST_BABEL_TRANSFORM_FILE_PATTERN]: [
      jestBaseConfig.transform[JEST_BABEL_TRANSFORM_FILE_PATTERN][0],
      /** Those can be any Babel options: https://babeljs.io/docs/options */
      { configFile: require.resolve('./babel.jest.config.react') },
    ],
  },
};

export default config;
