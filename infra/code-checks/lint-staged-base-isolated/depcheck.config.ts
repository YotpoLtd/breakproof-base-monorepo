import { getPackageAbsoluteDir } from '@repo/circular-dependency-workaround';

const { default: baseDepsCheckConfig } = (await import(
  `${getPackageAbsoluteDir('@repo/depcheck-base-isolated')}/lib/depcheckrc-base.mjs`
)) as {
  default: { ignores: Array<string> };
};
export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    // see other depcheck.config.ts files in the repo to see how to add ignored dependencies
  ],
};
