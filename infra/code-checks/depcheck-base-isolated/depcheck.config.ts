import baseDepsCheckConfig from './lib/depcheckrc-base.mjs';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    // see other depcheck.config.ts files in the repo to see how to add ignored dependencies
  ],
};
