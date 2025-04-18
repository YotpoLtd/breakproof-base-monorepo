import { execSync } from 'node:child_process';

import { ReleaseItConfig } from './release.types';

/**
 * Helper to merge the hooks of two `release-it` configs
 */
export const getMergedHooks = (
  baseConfig: ReleaseItConfig,
  newConfig: ReleaseItConfig,
): ReleaseItConfig['hooks'] => {
  const baseHooks = baseConfig.hooks || {};
  const newHooks = newConfig.hooks || {};
  return Object.fromEntries(
    [
      ...new Set([
        ...Object.keys(baseHooks),
        ...Object.keys(newConfig.hooks || {}),
      ]),
    ].map((hookNameStr) => {
      const hookName = hookNameStr as keyof Required<ReleaseItConfig>['hooks'];
      return [hookName, [baseHooks[hookName], newHooks[hookName]].flat()];
    }),
  );
};

export const getBuildAffectingPaths = (packageName: string) =>
  execSync(
    `pnpm $(pnpm --silent --workspace-root run repo:pnpm:expand-filters --ignore-devtools --filter='${packageName}...') list --depth -1 --parseable`,
    {
      shell: 'bash',
    },
  )
    .toString()
    .trim()
    .split('\n');
