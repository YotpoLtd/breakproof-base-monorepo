import baseConfig, {
  ESLINT_ARGS,
  ESLINT_CMD,
  ESLINT_PATTERN,
  getTypescriptLintStagedConfig,
  LINT_SHOULD_FIX,
  TSC_COMMANDS_PER_TSCONFIG,
} from './lintstagedrc-base-without-snapshotting.mjs';
import { LintStagedConfig } from './types.js';

export * from './lintstagedrc-base-without-snapshotting.mjs';

export const LINT_SHOULD_SNAPSHOT = Boolean(process.env.LINT_SHOULD_SNAPSHOT);

/**
 * There is an INTERMITTENT bug in `pnpm` when `--silent` is used together with `--stream`.
 * The result is nothing is being output.
 *
 * We don't pass `--stream` here but if `lint-staged` is executed from another `pnpm`
 * command that uses `--stream` or `--parallel` then the `--stream` mode is activated.
 *
 * So, we explicitly pass `--no-stream` to make sure, we don't hit this problem.
 *
 * And we don't know when it is appearing, so this fix must be added to docs
 * and applied to all packages that use error snapshotting like eslint or tsc snapshotting.
 *
 * Alternative fix, previously used was to unset `npm_config_stream=''` here.
 * @see https://pnpm.io/cli/run#--stream
 * @see https://pnpm.io/cli/run#options (search for --silent)
 */

export const TSC_COMMANDS_PER_TSCONFIG_WITH_SNAPSHOTTING: Record<
  string,
  keyof LintStagedConfig
> = Object.fromEntries(
  Object.entries(TSC_COMMANDS_PER_TSCONFIG).map(
    ([tsConfigFileName, tscCommand]) => {
      const errorsSnapshotFilename = `${tsConfigFileName.slice(0, tsConfigFileName.indexOf('.json'))}.problems-snapshot.json`;
      return [
        tsConfigFileName,
        `${tscCommand} --pretty false | pnpm --no-stream --filter='@repo/tsc-problem-snapshotter' run bin:ts ${LINT_SHOULD_SNAPSHOT ? 'remember-existing-problems' : 'check-new-problems'} --snapshot-filename='${errorsSnapshotFilename}'`,
      ];
    },
  ),
);

const config: LintStagedConfig = {
  ...baseConfig,
  [ESLINT_PATTERN]: LINT_SHOULD_FIX
    ? `${ESLINT_CMD} --fix`
    : (stagedFiles) => {
        return [
          `pnpm --silent --no-stream --filter="@repo/eslint-base-isolated" run eslint ${ESLINT_ARGS} --format json --no-error-on-unmatched-pattern ${stagedFiles.map((file) => `"${file}"`).join(' ')} | pnpm --silent --no-stream --filter="@repo/eslint-problem-snapshotter" run bin:ts ${LINT_SHOULD_SNAPSHOT ? 'remember-existing-problems' : 'check-new-problems'}`,
        ];
      },
  ...(!LINT_SHOULD_FIX &&
    getTypescriptLintStagedConfig(TSC_COMMANDS_PER_TSCONFIG_WITH_SNAPSHOTTING)),
};

export default config;
