import chalk from 'chalk';
import prompts from 'enquirer';
import terminalLink from 'terminal-link';

import { NODE_VERSIONS, NPM_SCOPES } from '@repo/environment';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import {
  HELP_ACTION_TEXT,
  InfraToolSubtype,
  NODE_VERSION_LATEST,
  PACKAGE_SUBTYPE_BY_TYPE,
  PackageType,
  TechStack,
} from '#extra-template-vars';
import {
  getDestinationByType,
  getRepoRootDir,
  printCheck,
  printContactHelp,
  printToTerminal,
} from '#helpers';
import * as sharedPrompts from '#shared-prompts';

import { params as lintParams } from '../../add/lint/prompt';
import { params as releaseParams } from '../../add/release/prompt';

/**
 * Ensures developer adds owners in CODEOWNERS file
 */
const ensureCodeowners = async (
  repoRootDir: string,
  projectDirs: Array<string>,
) => {
  printCheck(chalk.blue(`Checking for missing CODEOWNERS`));
  const { getCodeownersRules, getFileOwnershipInfo } = await import(
    '@repo/.github/codeowners-info'
  );

  if (
    !(
      await getFileOwnershipInfo(
        projectDirs.map((projectDir) => `${projectDir}/test.js`),
        await getCodeownersRules(),
      )
    ).filesWithoutOwner.size
  ) {
    printToTerminal(
      '✅️ Project has owners defined in <repo root>/.github/CODEOWNERS.',
    );
    return;
  }
  const hasAddedOwners = await prompts.quiz({
    ...sharedPrompts.COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: `${chalk.yellow(`Every project must have owners.
`)}`,
    message: `Can you add:
${chalk.green(`
${projectDirs.map((projectDir) => `${projectDir.replace(repoRootDir, '')} <YOUR TEAM NAME IN GITHUB>`).join('\n')}}
`)}
to ${terminalLink(
      chalk.green(`<repo root>/.github/CODEOWNERS`),
      `file://${repoRootDir}/.github/CODEOWNERS`,
    )}
`,
    choices: sharedPrompts.createDeveloperQuizOptions(),
  });
  if (hasAddedOwners.correct) {
    await ensureCodeowners(repoRootDir, projectDirs);
  } else {
    printContactHelp();
  }
};

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async ({
  args: cliArgs,
}: {
  args: Record<string, string>;
}) => {
  const type = await sharedPrompts.getType(cliArgs);

  const subtype =
    (cliArgs.subtype as InfraToolSubtype) ||
    (PACKAGE_SUBTYPE_BY_TYPE[type] &&
      (await prompts.autocomplete({
        message: 'Subtype of the package?',
        choices: Object.values(PACKAGE_SUBTYPE_BY_TYPE[type]!).map((value) => ({
          title: value,
          value,
        })),
      })));

  const techStack =
    cliArgs.techStack ||
    (type === PackageType.INFRA_TOOL || type === PackageType.E2E_APP
      ? TechStack.BASE
      : await prompts.autocomplete({
          message: 'Tech stack?',
          choices: Object.values(TechStack).map((value) => ({
            title: value,
            value,
          })),
        }));

  const nodeVersion =
    cliArgs.nodeVersion ||
    (type === PackageType.E2E_APP
      ? NODE_VERSION_LATEST
      : await prompts.autocomplete({
          message: 'Node version used by your package?',
          choices: NODE_VERSIONS.map((value) => ({
            title: value,
            value,
          })),
        }));

  if (techStack === TechStack.ANGULAR13) {
    throw new Error(
      `Generator for packages based on Angular 13 is not implemented yet! Please ${HELP_ACTION_TEXT}.`,
    );
  }

  const name =
    cliArgs.name ||
    (await prompts.input<string>({
      message: 'Package name (without the `@` scope)?',
      validate: (name) => {
        if (!name) {
          return 'Package name is required';
        }
        return true;
      },
    }));

  const npmScope =
    cliArgs.npmScope ||
    (await prompts.autocomplete({
      message: 'Full package name (with `@` scope)?',
      choices: NPM_SCOPES.map((scope) => ({
        title: `@${scope}/${name}`,
        value: scope,
      })),
    }));

  const nameWithScope = `@${npmScope}/${name}`;

  if (!cliArgs.skipCodeownersCheck) {
    await ensureCodeowners(getRepoRootDir(), [
      getDestinationByType({ type, subtype, name }),
      ...(type === PackageType.LIB
        ? [
            getDestinationByType({
              type: PackageType.APP,
              name: `sandbox-${name}`,
            }),
          ]
        : []),
      ...(type === PackageType.APP || type === PackageType.LIB
        ? [
            getDestinationByType({
              type: PackageType.E2E_APP,
              name: `sandbox-${name}-e2e`,
            }),
          ]
        : []),
    ]);
  }

  const hasRelease =
    type === PackageType.APP || type === PackageType.E2E_APP
      ? false
      : 'hasRelease' in cliArgs
        ? Boolean(cliArgs.hasRelease)
        : await prompts.toggle({
            message: 'Would this package be used outside this repository?',
            enabled: 'Yes, publish to npm & github',
            disabled: 'No, it will be internal only',
            initial: type === PackageType.LIB,
          });

  const releaseArgs = hasRelease
    ? await releaseParams({
        args: { ...cliArgs, type, name: nameWithScope, hasTsConfigNode: true },
      })
    : false;

  const lintArgs = await lintParams({
    args: {
      ...cliArgs,
      type,
      name: nameWithScope,
      hasTsConfigNode: true,
      hasTypescript: true,
    },
  });

  const isSandbox = await sharedPrompts.getIsSandbox(type, cliArgs);
  const supportingForProject = await sharedPrompts.getSupportingForProject(
    type,
    cliArgs,
    isSandbox,
  );

  return {
    type,
    subtype,
    techStack,
    nodeVersion,
    name,
    npmScope,
    nameWithScope,
    hasRelease,
    releaseArgs,
    lintArgs,
    isSandbox,
    supportingForProject,
  };
};
