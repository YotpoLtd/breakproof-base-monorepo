import nopt from '@pnpm/nopt';
import camelCase from 'camelcase';

import {
  filterPackagesExtended,
  type FilterPackagesExtendedOptions,
} from './filterPackagesExtended';

/**
 * CLI script that accepts --filter='' arguments like `pnpm` and returns
 * an "expanded" version of them.
 *
 * @example Given a repo with 3 packages: a,b,c:
 *
 * > $ pnpm node pnpm-expand-filters.mjs --filter='*'
 * > --filter='a' --filter='b' --filter='c'
 *
 * > $ pnpm node pnpm-expand-filters.mjs --filter='*'  --filter='!c'
 * > --filter='a' --filter='b'
 */

const CLI_OPTIONS_CONFIG = {
  filter: [String, Array],
  ['changed-files-ignore-pattern']: [String, Array],
  ['ignore-devtools']: Boolean,
};

const cliOptionsRaw = nopt(CLI_OPTIONS_CONFIG);
const cliOptions = Object.fromEntries(
  Object.entries(cliOptionsRaw).map(([cliOptionNameKebabCase, value]) => [
    camelCase(cliOptionNameKebabCase),
    value,
  ]),
) as FilterPackagesExtendedOptions;

const selectedGraph = await filterPackagesExtended(cliOptions);
const graphNodes = Object.entries(selectedGraph);

if (graphNodes.length) {
  // eslint-disable-next-line no-console -- This script purpose is to log
  console.log(
    graphNodes
      .map(
        ([, workspacePackageGraphNode]) =>
          `--filter=${String(workspacePackageGraphNode.package.manifest.name)}`,
      )
      .join(' '),
  );
}
