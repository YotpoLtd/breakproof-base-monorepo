import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: '@repo/cypress-base-isolated',
      reason: 'Used in templates but not in this package',
    }),
    defineIgnoredPackage({
      package: 'cypress',
      reason: 'Used in templates but not in this package',
    }),
    defineIgnoredPackage({
      package: '@repo/release-it-base-isolated',
      reason: 'Used in templates but not in this package',
    }),
    defineIgnoredPackage({
      package: '@repo/rollup-base-isolated',
      reason: 'Used in templates but not in this package',
    }),
    defineIgnoredPackage({
      package: '@repo/webpack-base-isolated',
      reason: 'Used in templates but not in this package',
    }),
    defineIgnoredPackage({
      package: '@types/fs-extra',
      reason: 'Peer dep of `zx`',
    }),
  ],
};
