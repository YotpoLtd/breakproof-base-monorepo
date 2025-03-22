import { getPackageAbsoluteDir } from '@repo/circular-dependency-workaround';

const sharedPrettierConfig = (
  await import(
    `${getPackageAbsoluteDir('@repo/eslint-base-isolated')}/lib/prettierrc-base.js`
  )
).default;

export default {
  ...sharedPrettierConfig,
};
