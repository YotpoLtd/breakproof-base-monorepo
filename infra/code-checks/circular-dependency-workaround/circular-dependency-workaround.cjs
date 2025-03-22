const { execSync } = require('node:child_process');

/**
 * There are packages like `eslint-base-isolated` that are likely to be used by all other packages
 * even those that `eslint-base-isolated` depends on.
 *
 * This creates a circular dependency.
 *
 * To avoid that we cannot declare them as real dependencies in `package.json`.
 * Instead, we need to reach out directly to the absolute path when importing
 */
const getPackageAbsoluteDir = circularDependencyPackageName =>
  execSync(`pnpm --filter="${circularDependencyPackageName}" exec pwd`, {
    shell: 'bash'
  })
    .toString()
    .trim();

module.exports = { getPackageAbsoluteDir };
