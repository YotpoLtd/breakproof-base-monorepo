import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: 'tslib',
      reason: 'used in the test setup',
    }),
    defineIgnoredPackage({
      package: '@jest/globals',
      reason:
        'this is installed but only used here, only re-exported via tsconfig.node.spec.base.json',
    }),
  ],
};
