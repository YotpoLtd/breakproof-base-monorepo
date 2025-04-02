/**
 * This file is imported & transpiled by `release-it`
 */
import * as path from 'node:path';

import findRoot from 'find-root';

import { getBuildAffectingPaths } from './release.config-helpers';
import { ReleaseItConfig } from './release.types';

export * from './release.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- This is a shortcut for reading JSON using require()
const PACKAGE_JSON = require(path.join(process.cwd(), `package.json`)) as {
  version: string;
  name: string;
};
const PACKAGE_NAME = PACKAGE_JSON.name;
const GIT_TAG_PREFIX = `${PACKAGE_NAME}@`;
const BUILD_AFFECTING_PATHS = getBuildAffectingPaths(PACKAGE_NAME);

export enum VersioningStrategy {
  CONENTIONAL_CHANGELOG = 'CONENTIONAL_CHANGELOG', // default
  FORCE_PUBLISH_CURRENT_VERSION = 'FORCE_PUBLISH_CURRENT_VERSION',
  SNAPSHOT = 'SNAPSHOT',
}

const getVersioningStrategyDefault = (): VersioningStrategy => {
  if (process.env.DEFAULT_RELEASE_IT_VERSIONING_STRATEGY) {
    if (
      !(
        process.env.DEFAULT_RELEASE_IT_VERSIONING_STRATEGY in VersioningStrategy
      )
    ) {
      throw new Error(
        `No such version strategy: ${process.env.DEFAULT_RELEASE_IT_VERSIONING_STRATEGY}`,
      );
    } else {
      return process.env
        .DEFAULT_RELEASE_IT_VERSIONING_STRATEGY as VersioningStrategy;
    }
  } else {
    return VersioningStrategy.CONENTIONAL_CHANGELOG;
  }
};

const getReleaseItBaseConfig: (
  versioningStrategy?: VersioningStrategy,
) => ReleaseItConfig = (versioningStrategy) => {
  const finalVersionStrategy =
    versioningStrategy || getVersioningStrategyDefault();

  return {
    plugins: {
      [require.resolve('@release-it/conventional-changelog')]: {
        infile: 'CHANGELOG.md',
        gitRawCommitsOpts: {
          'full-history': true,
          'no-merges': true,
          /**
           * @see https://github.com/conventional-changelog/conventional-changelog/blob/d3b8aaa16337993bbad4d91db1ffac5a7568756b/packages/conventional-changelog-core/README.md#gitrawcommitsopts
           * @see `path` can be an array https://github.com/conventional-changelog/conventional-changelog/blob/d3b8aaa16337993bbad4d91db1ffac5a7568756b/packages/git-client/src/GitClient.ts#L36-L44
           */
          path: BUILD_AFFECTING_PATHS,
        },
        tagPrefix: GIT_TAG_PREFIX,
        preset: require.resolve(
          `${findRoot(__dirname)}/conventional-changelog-preset.pnpm.mjs`,
        ),
        ...(finalVersionStrategy ===
          VersioningStrategy.FORCE_PUBLISH_CURRENT_VERSION && {
          version: PACKAGE_JSON.version,
        }),
        ...(finalVersionStrategy === VersioningStrategy.SNAPSHOT && {
          version: `${PACKAGE_JSON.version}-SNAPSHOT-${Date.now()}`,
        }),
      },
    },
    git: {
      commit: finalVersionStrategy !== VersioningStrategy.SNAPSHOT,
      push: finalVersionStrategy !== VersioningStrategy.SNAPSHOT,
      tag: finalVersionStrategy !== VersioningStrategy.SNAPSHOT,
      /**
       * `requireCleanWorkingDir` is to be removed once we have a stable release
       */
      requireCleanWorkingDir: false,
      // '${version}' is intentionally not in backticks, it is replaced by `release-it`
      commitMessage: `chore: release ${PACKAGE_NAME}@` + '${version}',
      tagName: GIT_TAG_PREFIX + '${version}',
    },
    github: {
      release: finalVersionStrategy !== VersioningStrategy.SNAPSHOT,
      releaseName: PACKAGE_NAME + ' ${version}',
    },
    /**
     * Account for pnpm workspace dependencies ("^workspace"):
     * https://github.com/release-it/release-it/issues/956
     */
    npm: {
      ...(finalVersionStrategy === VersioningStrategy.SNAPSHOT && {
        tag: 'snapshot',
      }),
      publish: true,
      publishPath: `*.tgz`,
    },
    hooks: {
      'before:release': ['pnpm -w shared:build:recursive'],
      'before:npm:release': ['pnpm pack'],
    },
  };
};

export default getReleaseItBaseConfig();
