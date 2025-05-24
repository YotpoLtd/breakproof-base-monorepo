import { Project as PnpmProject } from '@pnpm/types';

import { NODE_VERSIONS } from '@repo/environment';
import { getAllPackages } from '@repo/pnpm-helpers';

/**
 *
 *
 * Anything exported from this file is available to all generators template files (`*.ejs.t`)
 *
 *
 */

export enum PackageType {
  LIB = 'Library',
  APP = 'Application',
  E2E_APP = 'End-to-End (e2e) tests of App',
  INFRA_TOOL = 'Infrastructure tool',
}

export enum InfraToolSubtype {
  BUILD = 'Build-related tool',
  CODE_CHECKS = 'Code check tool',
  DEVX_AND_REPO = 'Repo-management, Developer experience or dev analysis tool',
  RELEASE = 'Release/Deployment tool',
  TEST = 'Testing tool',
  TO_EXTRACT = 'Tools that will be extracted in another pnpm-repo',
}

export const PACKAGE_SUBTYPE_BY_TYPE: Partial<
  Record<PackageType, typeof InfraToolSubtype>
> = {
  [PackageType.INFRA_TOOL]: InfraToolSubtype,
};

export enum TechStack {
  BASE = 'base',
  ANGULAR13 = 'angular13',
  REACT = 'react',
}

export const REPO_DIR_BY_PKG_TYPE = {
  [PackageType.LIB]: 'libs',
  [PackageType.APP]: 'apps',
  [PackageType.E2E_APP]: 'apps',
  [PackageType.INFRA_TOOL]: {
    [InfraToolSubtype.BUILD]: 'infra/build',
    [InfraToolSubtype.CODE_CHECKS]: 'infra/code-checks',
    [InfraToolSubtype.DEVX_AND_REPO]: 'infra/devx-and-repo',
    [InfraToolSubtype.RELEASE]: 'infra/release',
    [InfraToolSubtype.TEST]: 'infra/test',
    [InfraToolSubtype.TO_EXTRACT]: 'infra/to-extract-in-infra-repo',
  },
} as const;

export const getScriptsInfo = (
  type: PackageType,
  supportingForProject?: boolean | string,
): Record<string, string> => {
  return {
    'lint:precommit':
      'Before committing the `lint:precommit` script of each package that has been changed will be called',
    'lint:github-pr':
      'When a PR on GitHub is changed, the `lint:github-pr` script of each package that has been changed will be called',
    dev: `Runs this package in development mode, tracks for change of its own files. Does not track changes in dependencies.`,
    build: `Builds a production version of the package, writes files to disk, typically in the "./dist" subdirectory`,
    'dev:serve': `Similar to "dev" but meant for cases where development mode starts an http server (typically apps)`,
    'dev:watch': `Similar to "dev" and "dev:serve" but writes files to disk, typically in the "./dist" subdirectory`,
    'dev:with-deps': `Same as "dev" script but also tracks changes in dependencies by running their "dev:watch" or "dev:serve".`,
    'dev:with-lib': `Similar to"dev:with-deps" but only tracks changes of specific dependency AND allows customizing/forcing the name the script of that dependency which will be started, via the "FORCE_DEV_CMD" env variable.`,
    transpile: `A base script meant to be used by other scripts like "build", "build:watch" or "dev:watch"`,
    ...(type === PackageType.E2E_APP && {
      'test:e2e:dev': `Runs e2e testing framework (e.g. cypress) in debug/dev mode`,
      'test:e2e:run': `Runs e2e testing framework in headless mode (best for checking tests in terminal or CI)`,
      test: `Shorthand for test:e2e:run`,
      ...(Boolean(supportingForProject) && {
        'app:dev-for-e2e': `A helper script in e2e applications that will start the "dev:with-lib" of the application being tested and set "FORCE_DEV_CMD" to be "(dev|build):watch" (regex). This will make sure the bundle of the applicaiton is written to disk`,
        'app:serve': `A helper script in e2e applications start a static http server at the "./dist" directory of the application being tested. Works well together with "app:dev-for-e2e"`,
        'dev:with-app':
          'Launches "app:dev-for-e2e", "app:serve" and "test:e2e:dev" together',
      }),
    }),
  };
};

export const CONTACT_HELP_URL =
  'https://github.com/YotpoLtd/breakproof-base-monorepo/issues';
export const HELP_ACTION_TEXT =
  'search or create an issue at https://github.com/YotpoLtd/breakproof-base-monorepo';
export const HELP_ACTION_PROMISE_TEXT = `I will ${HELP_ACTION_TEXT}`;

interface PnpmProjectWithName extends Omit<PnpmProject, 'manifest'> {
  manifest: Omit<PnpmProject['manifest'], 'name'> & {
    name: string;
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention -- Mimicking a constant on purpose
let PACKAGES: Array<PnpmProjectWithName> = [];
export const refreshPackages = async () => {
  PACKAGES = Object.values(
    (await getAllPackages()) as Array<PnpmProjectWithName>,
  );
};
export const getPackagesCached = () => PACKAGES;
export const getPackages = async () => {
  if (!PACKAGES.length) {
    await refreshPackages();
  }
  return getPackagesCached();
};
export const NODE_VERSION_LATEST = [...NODE_VERSIONS].sort().reverse()[0]!;
