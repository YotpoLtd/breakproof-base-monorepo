// @ts-check
/**
 * This is a configuration file for the `syncpack` tool which helps us enforce
 * the versions for the specific dependency across packages to be the same one
 * (if we want to)
 */
/**
 * @type {Partial<
 *   import('./infra/code-checks/syncpack-base-isolated/node_modules/syncpack/dist/config/types').RcConfig
 * >}
 */
const config = {
  lintFormatting: false,
  customTypes: {
    // syncpack doesn't check optional deps by default
    optional: {
      path: 'optionalDependencies',
      strategy: 'versionsByName',
    },
    // Our custom section of dependencies, @see .pnpmfile.cjs for more
    devtools: {
      path: 'devtoolsDependencies',
      strategy: 'versionsByName',
    },
    packageManager: {
      path: 'packageManager',
      strategy: 'name@version',
    },
    version: {
      path: 'version',
      strategy: 'version',
    },
  },
  versionGroups: [
    {
      // Don't force version for peer deps with standard API
      label: 'Do not fix peer deps defined as `*` or `workspace:`',
      dependencyTypes: ['peer'],
      specifierTypes: ['*', 'workspace-protocol'],
      packages: ['**'],
      isIgnored: true,
    },
    {
      label:
        'Versions of `rollup`-related packages IN SPECIFIC REPO PACKAGES should match whatever `@repo/rollup-base-isolated` has installed',
      dependencies: ['rollup*', '@rollup/*'],
      packages: ['@repo/rollup-base-isolated'],
      snapTo: ['@repo/rollup-base-isolated'],
    },
    /**
     * This is the place where to specify if we want certain dependency to be
     * the same version across multiple packages.
     *
     * Example of rule that will make all versions of typescript either be the
     * latest any package uses or exact version
     */
    // {
    //   label: '----concise title for this rul----',
    //   dependencies: ['typescript'],
    //   packages: ['**'],
    //   // pinVersion: '>=5.0.0',
    //   // preferVersion: 'highestSemver',
    //   isIgnored: false
    // },
    /**
     * Example of a rule that will make prettier versions the same across all packages
     */
    // {
    //   label:
    //       'All `prettier` versions should match whatever `@repo/eslint-base-isolated` has installed',
    //   dependencies: ['prettier'],
    //   packages: ['**'],
    // },
    {
      // Don't force versions by default
      label: 'Ignore all by default',
      dependencies: ['**'],
      isIgnored: true,
    },
  ],
  dependencyTypes: [
    'prod',
    'dev',
    'peer',
    'optional',
    'devtools',
    'overrides',
    'pnpmOverrides',
    'resolutions',
    'packageManager',
    'version',
  ],
};

export default config;
