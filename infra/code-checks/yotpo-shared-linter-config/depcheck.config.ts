import { getPackageAbsoluteDir } from '@repo/circular-dependency-workaround';

const { default: baseDepsCheckConfig, defineIgnoredPackage } = (await import(
  `${getPackageAbsoluteDir('@repo/depcheck-base-isolated')}/lib/depcheckrc-base.mjs`
)) as {
  default: { ignores: Array<string> };
  defineIgnoredPackage: (def: { package: string; reason: string }) => string;
};

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: '@typescript-eslint/eslint-plugin',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: '@typescript-eslint/parser',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-import-resolver-typescript',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-diff',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-eslint-comments',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-promise',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-react',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-react-hooks',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-sonarjs',
      reason: 'This plugin is still using the old eslint config',
    }),
    defineIgnoredPackage({
      package: 'eslint-plugin-unicorn',
      reason: 'This plugin is still using the old eslint config',
    }),
  ],
};
