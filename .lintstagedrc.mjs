/**
 * This config IS NOT RELATED to the projects in this repo.
 * It is only used for the repository top-level files which are outside any project,
 * e.g. `<repo root dir>/package.json` or ``<repo root dir>/README.md`
 */
import baseLintStagedConfig from './infra/code-checks/lint-staged-base-isolated/lib/lintstagedrc-base.mjs';

// limit checks to only files at the repository root
const baseConfigButOnlyTopLevelFiles = Object.fromEntries(
  Object.entries(baseLintStagedConfig).map(([pattern, command]) => [
    `./${pattern}`,
    command,
  ]),
);

export default baseConfigButOnlyTopLevelFiles;
