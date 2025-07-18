import { ESLint, Linter } from 'eslint';
import { Config as LintStagedConfigImported } from 'lint-staged';
import { Config as PrettierConfigImported } from 'prettier';

export type EslintConfigEntry = Linter.Config;
export type EslintConfig = Array<EslintConfigEntry>;
export type EslintPlugin = ESLint.Plugin;

export type LintStagedConfig = Exclude<
  LintStagedConfigImported,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This generic type definition requires any
  (...args: Array<any>) => any
>;
export type PrettierConfig = PrettierConfigImported;
