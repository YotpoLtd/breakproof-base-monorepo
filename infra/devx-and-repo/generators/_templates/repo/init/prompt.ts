import chalk from 'chalk';
import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import {
  COMMON_DEVELOPER_QUIZ_OPTIONS,
  createQuizStepHeader,
} from '#shared-prompts';

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async () => {
  const hasConfirmedNodeVersions = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      1,
      `
 ${chalk.yellow(
   '`<repo root>/.nodejs-versions-whitelist.cjs` defines the node versions that packages in this repo can use.',
 )}`,
    ),
    message: `Confirm or modify .nodejs-versions-whitelist.cjs`,
  });

  const hasConfirmedNpmrc = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      2,
      `
 ${chalk.yellow('The `use-node-version` property in `<repo root>/.npmrc` defines default node.js used in this repo')}`,
    ),
    message: `Confirm or modify \`use-node-version\` in \`.npmrc\``,
  });

  const hasConfirmedNpmScopes = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      3,
      `
 ${chalk.yellow('`<repo root>/.npm-scopes-whitelist.cjs` defines the allowed @scope of new packages')}
 ${chalk.italic(chalk.yellowBright('(a.k.a. the "@rollup" in "@rollup/plugin-typescript")'))}`,
    ),
    message: `Confirm or modify .npm-scopes-whitelist.cjs`,
  });

  return {
    hasConfirmedNodeVersions,
    hasConfirmedNpmScopes,
    hasConfirmedNpmrc,
  };
};
