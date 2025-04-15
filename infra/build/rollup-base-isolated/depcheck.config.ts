import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: '@rollup/plugin-swc',
      reason: 'Used in package.json scripts to read the *.ts rollup config',
    }),
    defineIgnoredPackage({
      package: 'tslib',
      reason: 'Typescript compiled libs like this one need this',
    }),
  ],
};
