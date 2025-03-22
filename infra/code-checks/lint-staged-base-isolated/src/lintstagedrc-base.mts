import baseConfig, {
  ESLINT_ARGS,
  ESLINT_CMD,
  ESLINT_PATTERN,
  LINT_SHOULD_FIX,
} from './lintstagedrc-base-without-snapshotting.mjs';
import { LintStagedConfig } from './types.js';
export * from './lintstagedrc-base-without-snapshotting.mjs';

const config: LintStagedConfig = {
  ...baseConfig,
  [ESLINT_PATTERN]: LINT_SHOULD_FIX
    ? `${ESLINT_CMD} --fix`
    : (stagedFiles) => {
        return [
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
           * and applied to all packages that use eslint snapshotting or other kind of snapshotting.
           *
           * Alternative fix, previously used was to unset `npm_config_stream=''` here.
           * @see https://pnpm.io/cli/run#--stream
           * @see https://pnpm.io/cli/run#options (search for --silent)
           */
          `pnpm --silent --no-stream --filter="@repo/eslint-base-isolated" run eslint ${ESLINT_ARGS} --format json --no-error-on-unmatched-pattern ${stagedFiles.map((file) => `"${file}"`).join(' ')} | pnpm  --silent --no-stream --filter="@repo/eslint-problem-snapshotter" run bin check-new-problems`,
        ];
      },
};

export default config;
