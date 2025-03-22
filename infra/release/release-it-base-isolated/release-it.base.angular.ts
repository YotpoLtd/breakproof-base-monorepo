/**
 * This file is imported & transpiled by `release-it`
 */
import { ReleaseItConfig } from './release.types';
import baseConfig from './release-it.base';
export * from './release.types';

const config: ReleaseItConfig = {
  ...baseConfig,
  npm: {
    publishPath: `./dist`,
  },
  hooks: {
    'before:npm:release': ['pnpm build'],
  },
};

export default config;
