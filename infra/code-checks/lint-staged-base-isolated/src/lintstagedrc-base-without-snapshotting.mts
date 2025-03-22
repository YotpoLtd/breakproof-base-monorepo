import * as path from 'node:path';

import { getTsconfig } from 'get-tsconfig';
import { glob } from 'glob';
import micromatch from 'micromatch';

import { LintStagedConfig } from './types.js';

const PACKAGE_DIR = process.cwd();

export const TSC_CONFIG_FILENAMES = await glob('tsconfig*.json');

type LintStagedConfigKey = string;
export const ESLINT_PATTERN: LintStagedConfigKey =
  '*.{js,mjs,cjs,ts,mts,tsx,jsx,json,json5}';
export const ESLINT_PATTERN_OPPOSITE: LintStagedConfigKey = `!(${ESLINT_PATTERN})`;
export const PRETTIER_PATTERN: LintStagedConfigKey = ESLINT_PATTERN_OPPOSITE;
// creating multiple TS patterns, each for different tsconfig file, so that lint-staged can run them in parallel
export const TSC_PATTERNS_PER_TSCONFIG: Record<string, keyof LintStagedConfig> =
  Object.fromEntries(
    TSC_CONFIG_FILENAMES.map((tsConfigFileName) => [
      tsConfigFileName,
      `*.{ts,mts,cts,tsx,check-using-${tsConfigFileName}}`,
    ]),
  );

export const ESLINT_ACTIVE_CONFIG: string =
  process.env.CUSTOM_ESLINT_CONFIG || 'eslint.config.cjs';
export const LINT_SHOULD_FIX = Boolean(process.env.LINT_AUTOFIX);

export const ESLINT_ARGS = `--config=${ESLINT_ACTIVE_CONFIG} --report-unused-disable-directives --no-config-lookup`;
export const ESLINT_CMD = `pnpm --filter="@repo/eslint-base-isolated" run eslint ${ESLINT_ARGS}`;

/**
 * TypeScript checking must account for different `tsconfig` files.
 * We create multiple TS commands, each for different tsconfig file,
 * so that lint-staged can run them in parallel
 *
 * @see https://github.com/microsoft/TypeScript/issues/53979
 */
export const TSC_COMMANDS_PER_TSCONFIG: Record<string, keyof LintStagedConfig> =
  Object.fromEntries(
    TSC_CONFIG_FILENAMES.map((tsConfigFileName) => [
      tsConfigFileName,
      `pnpm exec tsc --project ${tsConfigFileName} --noEmit`,
    ]),
  );

/**
 * Creates a `LintStagedConfig` by mapping tsconfig files to their suitable lint-staged command.
 *
 * Uses `TSC_CONFIG_FILENAMES` (list of tsconfig filenames) and
 * `tscCommandsPerTsconfig` to determine which commands to run based on changed files
 * and their match with tsconfig `include`/`exclude` patterns.
 *
 * @param tscCommandsPerTsconfig - Mapping of tsconfig filenames to lint-staged commands.
 * @returns {LintStagedConfig}
 *   An object where keys are patterns, and values are functions deciding commands for matching files.
 *
 * @example
 * const tscCommands = {
 *   'tsconfig.app.json': 'tsc --noEmit',
 *   'tsconfig.lib.json': 'tsc --noEmit --project ./libs'
 * };
 */
export const getTypescriptLintStagedConfig = (
  tscCommandsPerTsconfig: Record<string, keyof LintStagedConfig>,
): LintStagedConfig => {
  if (!Array.isArray(TSC_CONFIG_FILENAMES)) {
    return {};
  }
  return Object.fromEntries(
    TSC_CONFIG_FILENAMES.map((tsConfigFileName) => [
      TSC_PATTERNS_PER_TSCONFIG[tsConfigFileName],
      (changedFilePaths: string[]) => {
        const changedRelativeFilePaths = changedFilePaths.map(
          (absoluteFilePath) => path.relative(PACKAGE_DIR, absoluteFilePath),
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know that such file exists as we previously found it via glob
        const config = getTsconfig(PACKAGE_DIR, tsConfigFileName)!.config;
        const matches = micromatch(changedRelativeFilePaths, [
          ...(config.include || []),
          ...(config.exclude || []).map((pattern) => `!${pattern}`),
        ]);
        return matches.length ? [tscCommandsPerTsconfig[tsConfigFileName]] : [];
      },
    ]),
  ) as LintStagedConfig;
};

/**
 * The final `lint-staged` base config
 */
const config: LintStagedConfig = {
  [ESLINT_PATTERN]: `${ESLINT_CMD} ${LINT_SHOULD_FIX ? '--fix' : ''}`,
  [PRETTIER_PATTERN]: `pnpm exec prettier --ignore-unknown --no-error-on-unmatched-pattern ${LINT_SHOULD_FIX ? '--write' : '--check'}`,
  ...(!LINT_SHOULD_FIX &&
    getTypescriptLintStagedConfig(TSC_COMMANDS_PER_TSCONFIG)),
};

export default config;
