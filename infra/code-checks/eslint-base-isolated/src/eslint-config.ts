import yotpoBaseConfig from '@yotpo-common/shared-linter-config/eslint-config-base';
import yotpoBrowserConfig from '@yotpo-common/shared-linter-config/eslint-config-browser';
import yotpoNodeConfig from '@yotpo-common/shared-linter-config/eslint-config-node';
import yotpoReactConfig from '@yotpo-common/shared-linter-config/eslint-config-react';

import packageJsonSorting from './eslint-package-json';
import { EslintConfig } from './types';

export const base: EslintConfig = [...yotpoBaseConfig, ...packageJsonSorting];
export const node: EslintConfig = [...yotpoNodeConfig, ...packageJsonSorting];
export const react: EslintConfig = [...yotpoReactConfig, ...packageJsonSorting];
export const browser: EslintConfig = [
  ...yotpoBrowserConfig,
  ...packageJsonSorting,
];

export * from '@yotpo-common/shared-linter-config/ts-code-editor-helper';
