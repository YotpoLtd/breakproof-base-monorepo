import { getPackageAbsoluteDir } from '@repo/circular-dependency-workaround';

const baseLintStagedConfig = (
  await import(
    `${getPackageAbsoluteDir('@repo/lint-staged-base-isolated')}/lib/lintstagedrc-base.mjs`
  )
).default;

export default { ...baseLintStagedConfig };
