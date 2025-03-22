import globals from 'globals';

import { EslintConfigEntry } from '../types';

const config: EslintConfigEntry = {
  languageOptions: {
    globals: globals.node,
  },
};
export = config;
