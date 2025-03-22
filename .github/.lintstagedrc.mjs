import baseLintStagedConfig from '@repo/lint-staged-base-isolated/base';

export default {
  ...baseLintStagedConfig,
  'workflows/*.{yml,yaml}': 'pnpm exec actionlint',
};
