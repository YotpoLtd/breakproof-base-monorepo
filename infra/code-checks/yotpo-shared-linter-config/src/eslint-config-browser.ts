import globals from 'globals';

import baseConfig from './eslint-config-base';
import { EslintConfig } from './types';

const config: EslintConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];

export = config;
