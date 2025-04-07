import sharedPrettierConfig from './lib/prettierrc-base.js';

/** @type {import('./src/types').PrettierConfig} */
const config = {
  ...sharedPrettierConfig,
};

export default config;
