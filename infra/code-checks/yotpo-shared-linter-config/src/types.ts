import { Linter } from 'eslint';
import { Config as LintStagedConfigImported } from 'lint-staged';
import { Config as PrettierConfigImported } from 'prettier';

export type EslintConfigEntry = Linter.Config;
export type EslintConfig = Array<EslintConfigEntry>;

export type LintStagedConfig = Exclude<
  LintStagedConfigImported,
  (...args: Array<any>) => any
>;
export type PrettierConfig = PrettierConfigImported;
