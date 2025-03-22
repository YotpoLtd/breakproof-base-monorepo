import baseDepsCheckConfig from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    // see other depcheck.config.ts files in the repo to see how to add ignored dependencies
  ],
};
