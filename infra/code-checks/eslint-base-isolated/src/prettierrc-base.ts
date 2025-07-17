import yotpoSharedPrettierConfig from '@yotpo-common/shared-linter-config/prettier-config-base';

import { PrettierConfig } from './types.js';

const config: PrettierConfig = {
  ...yotpoSharedPrettierConfig,
  plugins: [require.resolve('prettier-plugin-jsdoc')],
};

export = config;
