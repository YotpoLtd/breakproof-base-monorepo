import browserConfig from './eslint-config-browser';
import nodeConfig from './eslint-config-node';
import { EslintConfig } from './types';

const config: EslintConfig = [...nodeConfig, ...browserConfig];
export = config;
