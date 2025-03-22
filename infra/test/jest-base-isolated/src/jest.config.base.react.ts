import * as path from 'node:path';

import jestBaseConfig from './jest.config.base';
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
};

export default config;
