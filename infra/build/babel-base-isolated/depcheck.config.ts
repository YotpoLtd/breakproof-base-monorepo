import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: 'babel-jest',
      reason: `
        This is installed here but used in @repo/jest-base-isolated
        It is installed here, so that it lives along and uses all other babel* related packages.
        `,
    }),
    defineIgnoredPackage({
      package: '@babel/plugin-proposal-class-properties',
      reason:
        'currently commented out but kept here as a reminder to research usage',
    }),
    defineIgnoredPackage({
      package: 'tslib',
      reason: 'Typescript compiled libs like this one need this',
    }),
  ],
};
