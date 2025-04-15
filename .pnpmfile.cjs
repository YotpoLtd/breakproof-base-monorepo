const process = require('node:process');

require('./infra/devx-and-repo/repo-shell-scripts/verify-.githooks-dir.cjs');


/**
 * We can't remove things using the top-level package.json5
 * (and its pnpm.packageExtensions settings), so we are doing
 * this here programmatically.
 *
 * For anything we want to ADD, we define in top-level package.json5
 * under pnpm.packageExtensions
 */
const fixTypescriptInCosmicConfig = (packageJsonParsed) => {
  if (
    packageJsonParsed.peerDependencies.typescript ||
    packageJsonParsed.peerDependenciesMeta.typescript
  ) {
    packageJsonParsed.dependencies.typescript =
      packageJsonParsed.peerDependencies.typescript;
    delete packageJsonParsed.peerDependencies.typescript;
    delete packageJsonParsed.peerDependenciesMeta.typescript;
  }
  return packageJsonParsed;
};

module.exports = {
  hooks: {
    readPackage: (packageJsonParsed) => {
      /**
       * Convert `codeEditorIntegrationDependencies` property in <repo root>/package.json5 to optionalDependencies
       */
      if (
        !process.env.GITHUB_ENV &&
        process.env.CODE_EDITOR_INSTALL &&
        packageJsonParsed.name === '@repo/root'
      ) {
        packageJsonParsed.optionalDependencies =
          packageJsonParsed.codeEditorIntegrationDependencies;
      }
      /**
       * Apply fixes to third party package.json that we can't do via `packageExtensions` in <repo root>/package.json5
       */
      let packageJsonParsedFinal = packageJsonParsed;
      if (packageJsonParsedFinal.name === 'cosmiconfig') {
        packageJsonParsedFinal = fixTypescriptInCosmicConfig(packageJsonParsed);
      }
      if (packageJsonParsedFinal.name === 'webpack') {
        delete packageJsonParsed.peerDependenciesMeta['webpack-cli'];
      }
      return packageJsonParsedFinal;
    },
  },
};
