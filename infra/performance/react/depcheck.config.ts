import baseDepsCheckConfig from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [...baseDepsCheckConfig.ignores],
};
