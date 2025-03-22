import baseLintStagedConfig, {
  getTypescriptLintStagedConfig,
  TSC_COMMANDS_PER_TSCONFIG,
} from '@repo/lint-staged-base-isolated/base';

export default {
  ...baseLintStagedConfig,
  ...getTypescriptLintStagedConfig({
    ...TSC_COMMANDS_PER_TSCONFIG,
    /** This is required to run typescript checks from the @repo/lint package instead of the current package. */
    'tsconfig.json': 'tsc --project tsconfig.json --noEmit',
  }),
};
