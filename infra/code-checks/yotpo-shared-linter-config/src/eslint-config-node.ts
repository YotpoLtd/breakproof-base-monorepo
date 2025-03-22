import baseConfig from './eslint-config-base';
import nodeGlobalsConfig from './partials/eslint-config-node-globals';
import { EslintConfig } from './types';

const config: EslintConfig = [...baseConfig, nodeGlobalsConfig];
export = config;
