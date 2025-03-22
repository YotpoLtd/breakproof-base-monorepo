const process = require('node:process');

require('./infra/devx-and-repo/repo-shell-scripts/verify-.githooks-dir.cjs');
const { getPnpmCommand, getPnpmPackages } = require('./infra/devx-and-repo/repo-shell-scripts/pnpmfile-helper.cjs');

const WORKSPACE_PACKAGES = getPnpmPackages();
const ORIGINAL_WORKSPACE_PACKAGE_JSON_MAP = new Map();

/**
 *
 * Instead of writing custom logic to figure out which packages in the repo
 * can affect the build & runtime of other packages, let's patch the existing
 * `pnpm --filter-prod` to do that.
 *
 * During pnpm --filter-prod process:
 *
 * 1. Let's tell pnpm to treat `devDependencies` as part of `dependencies`
 *    so that --filter-prod still selects them
 * 2. Let's allow a new property for dependencies in package.json
 *    called `devtoolsDependencies`. Whatever is defined inside, we will tell
 *    pnpm to treat as `devDependencies`, so that --filter-prod DOESN'T select them
 *
 */
const patchPackageJsonAndAddDevtoolsDependencies = packageJson => {
  if (
    packageJson.name &&
    WORKSPACE_PACKAGES.some(workspacePackageInfo => packageJson.name === workspacePackageInfo.name)
  ) {
    ORIGINAL_WORKSPACE_PACKAGE_JSON_MAP.set(packageJson.name, { ...packageJson });
    if (packageJson.devDependencies) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      delete packageJson.devDependencies;
    }
    if (packageJson.devtoolsDependencies) {
      packageJson.devDependencies = packageJson.devtoolsDependencies;
      delete packageJson.devtoolsDependencies;
    }
  }

  return packageJson;
};

// we don't want to edit package.json loading during publishing to `npm` registry
const pnpmCommand = getPnpmCommand(process.argv);
const IS_RELEASING_PACKAGE = pnpmCommand === 'pack' || pnpmCommand === 'publish';

if (!IS_RELEASING_PACKAGE) {
  const originalJsonParse = JSON.parse.bind(JSON);
  const originalJsonStringify = JSON.stringify.bind(JSON);
  JSON.parse = (text, ...otherArgs) =>
    patchPackageJsonAndAddDevtoolsDependencies(originalJsonParse(text, ...otherArgs));
  JSON.stringify = (obj, ...otherArgs) => {
    let finalObject = obj;
    const workspacePackageOriginalJson = ORIGINAL_WORKSPACE_PACKAGE_JSON_MAP.get(obj.name);
    if (
      workspacePackageOriginalJson &&
      ((workspacePackageOriginalJson.devDependencies && !finalObject.devDependencies) ||
        (workspacePackageOriginalJson.devtoolsDependencies && !finalObject.devtoolsDependencies))
    ) {
      finalObject = { ...obj };
      if (workspacePackageOriginalJson.devtoolsDependencies) {
        finalObject.devtoolsDependencies = finalObject.devDependencies;
        delete finalObject.devDependencies;
      }
      if (workspacePackageOriginalJson.devDependencies) {
        finalObject.devDependencies = {};
        finalObject.dependencies = { ...finalObject.dependencies };
        Object.keys(workspacePackageOriginalJson.devDependencies).forEach(dependencyName => {
          if (finalObject.dependencies[dependencyName]) {
            finalObject.devDependencies[dependencyName] = finalObject.dependencies[dependencyName];
            delete finalObject.dependencies[dependencyName];
          }
        });
      }
    }
    return originalJsonStringify(finalObject, ...otherArgs);
  };
}

/**
 * We can't remove things using the top-level package.json5
 * (and its pnpm.packageExtensions settings), so we are doing
 * this here programmatically.
 *
 * For anything we want to ADD, we define in top-level package.json5
 * under pnpm.packageExtensions
 */
const fixTypescriptInCosmicConfig = packageJsonParsed => {
  if (packageJsonParsed.peerDependencies.typescript || packageJsonParsed.peerDependenciesMeta.typescript) {
    packageJsonParsed.dependencies.typescript = packageJsonParsed.peerDependencies.typescript;
    delete packageJsonParsed.peerDependencies.typescript;
    delete packageJsonParsed.peerDependenciesMeta.typescript;
  }
  return packageJsonParsed;
};

module.exports = {
  hooks: {
    readPackage: packageJsonParsed => {
      /**
       * Convert `codeEditorIntegrationDependencies` property in <repo root>/package.json5 to optionalDependencies
       */
      if (!process.env.GITHUB_ENV && process.env.CODE_EDITOR_INSTALL && packageJsonParsed.name === '@repo/root') {
        packageJsonParsed.optionalDependencies = packageJsonParsed.codeEditorIntegrationDependencies;
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
    }
  }
};
