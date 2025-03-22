import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: 'tslib',
      reason: 'Typescript compiled libs like this one need this',
    }),
    defineIgnoredPackage({
      package: '@jest/globals',
      reason:
        'this is installed but only used here, only re-exported via tsconfig.node.spec.base.json',
    }),
  ],
};
