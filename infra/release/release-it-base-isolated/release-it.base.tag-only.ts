/** This file is imported & transpiled by `release-it` */
import type { ReleaseItConfig } from './release.types';
import baseConfig from './release-it.base';
export * from './release.types';

const tagOnlyConfig: ReleaseItConfig = {
  ...baseConfig,
  // @ts-expect-error -- `false` valid value for `npm` without types
  npm: false,
  git: {
    ...baseConfig.git,
    commit: false,
    push: false,
    requireUpstream: false,
  },
  hooks: {},
};

export default tagOnlyConfig;
