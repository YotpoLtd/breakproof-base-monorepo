import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

import { getSemverTags } from 'git-semver-tags';

import originalYotpoConventionalChangelogPresetPromise from '@repo/conventional-changelog-preset';
const require = createRequire(import.meta.url);

// const GIT_USER_EMAIL = execSync(`git config user.email`).toString().trim();

const getPackageCommitsHashesSinceLastStableRelease = async () => {
  const projectPath = process.cwd();
  const packageName = require(`${projectPath}/package.json`).name;
  const latestStablePackageReleaseTag = (
    await getSemverTags({ tagPrefix: `${packageName}@`, skipUnstable: true })
  )[0];
  const gitDiff = `${latestStablePackageReleaseTag ? `${latestStablePackageReleaseTag}..` : ''}HEAD`;
  return new Set(
    /**
     * This git command accounts for the `gitRawCommitsOpts` options passed to @release-it/conventional-changelog
     */
    execSync(
      `git log --pretty=format:"%H" --full-history --no-merges ${gitDiff} -- ${projectPath}`,
    )
      .toString()
      .trim()
      .split('\n'),
  );
};

const THIS_PACKAGE_COMMITS_SET =
  await getPackageCommitsHashesSinceLastStableRelease();
const ORIGINAL_YOTPO_PRESET =
  await originalYotpoConventionalChangelogPresetPromise;

export default async () => {
  let hasIncludedFakeCommit = false;

  return {
    ...ORIGINAL_YOTPO_PRESET,

    recommendedBumpOpts: {
      ...ORIGINAL_YOTPO_PRESET.recommendedBumpOpts,
      whatBump: (commits) => {
        const packageOnlyCommits = commits.filter((c) =>
          THIS_PACKAGE_COMMITS_SET.has(c.hash),
        );
        const workspaceDependenciesCommits = commits.filter(
          (c) => !THIS_PACKAGE_COMMITS_SET.has(c.hash),
        );

        return (
          /**
           * Passthrough the originally calculated version change if the commit is in the package itself
           */
          ORIGINAL_YOTPO_PRESET.recommendedBumpOpts.whatBump(
            packageOnlyCommits,
          ) ||
          /**
           * Otherwise, if there is release-triggering commit in dependencies affecting the build
           * Mark release as a patch "chore" release.
           */
          (ORIGINAL_YOTPO_PRESET.recommendedBumpOpts.whatBump(
            workspaceDependenciesCommits,
          ) && {
            level: 2,
            reason: `Workspace packages have changed`,
          })
        );
      },
    },

    /**
     * Tweaks for how the CHANGELOG.md is created
     */
    writerOpts: {
      ...ORIGINAL_YOTPO_PRESET.writerOpts,
      transform: (commit, context) => {
        const originalTransformation =
          ORIGINAL_YOTPO_PRESET.writerOpts.transform(commit, context);

        if (THIS_PACKAGE_COMMITS_SET.has(commit.hash)) {
          /**
           * Pass through commits that belong to this package
           */
          return originalTransformation;
        } else if (originalTransformation && !hasIncludedFakeCommit) {
          hasIncludedFakeCommit = true;
          /**
           * Return "fake" commit to include in the changelog.
           * Make sure there is only one such "fake" commit.
           */
          return {
            type: 'Chores',
            subject: 'bump version due to workspace dependency changes',
            header: 'chore: bump version due to workspace dependency changes',
            notes: [],
            references: [],
            mentions: [],
            committerDate: Date.now(),
          };
        } else {
          /**
           * Don't write this commit in the changelog
           */
          return null;
        }
      },
    },
  };
};
