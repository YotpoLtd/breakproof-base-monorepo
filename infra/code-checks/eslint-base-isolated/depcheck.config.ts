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
      package: 'ajv',
      reason:
        'We add this as peer dependency to `eslint-plugin-json-schema-validator` as part of our patch',
    }),
  ],
};
