import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { getRepoRootDir, printError, printToTerminal } from '#helpers';
import {
  COMMON_DEVELOPER_QUIZ_OPTIONS,
  createQuizStepHeader,
} from '#shared-prompts';
import { $runAndShowBash as $, $spinner, chalk, fs } from '#zx';

import { params as startOnboarding } from '../onboard/prompt';
import { printWelcome } from '../onboard/welcome';
import { printRepoTreePreview } from './repo-tree-preview';
import { createTemplateRenderer } from './template';

const renderTemplate = createTemplateRenderer(__dirname);

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async () => {
  const repoRoot = await getRepoRootDir();
  process.chdir(repoRoot);
  let stepNum = 0;

  printWelcome();

  stepNum++;
  const hasConfirmedStart = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      stepNum,
      `
 ${chalk.yellow(`This guide begins with a partial overview of the repo structure`)}`,
    ),
    initial: 1,
    choices: ['Not yet', `Yes, let's go!\n`],
    message: `Ready?`,
  });

  if (!hasConfirmedStart) {
    printToTerminal(`Alright 👍. Do what you need!`);
    return;
  }

  printRepoTreePreview(repoRoot);

  await prompts.select({
    prefix: {
      pending: `${chalk.yellow`  You can change those files any time, but it's a good to take a look`}
  ${chalk.whiteBright`Once you are happy with node versions, npm scopes, configs, etc, please continue.`}`,
      submitted: `  The breakproof file structure`,
    },
    message: '',
    choices: [`Let's continue`],
  });

  stepNum++;
  printToTerminal(createQuizStepHeader(stepNum));

  const isSingleTeam = (
    await prompts.quiz({
      ...COMMON_DEVELOPER_QUIZ_OPTIONS,
      prefix: ' ',
      message: 'Are all projects maintained by a single team/developer?',
      choices: ['No, different teams will own different projects', 'Yes\n'],
    })
  ).correct;

  const currentTeamName = await prompts.input({
    message: `What's the name of the team/developer in GitHub${!isSingleTeam ? ' keeping the general repo up-to-date' : ''}?`,
    validate: (typedCurrentTeamName) => {
      if (!typedCurrentTeamName) {
        return `Type your GitHub username if you are not sure`;
      }
      if (typedCurrentTeamName.startsWith('@')) {
        return `Type the name without a leading '@'`;
      }
      return true;
    },
  });

  stepNum++;
  const hasConfirmedCommits = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      stepNum,
      `
 ${chalk.yellow(
   'This script will now create 2 git commits to initiate your breakproof fork',
 )}`,
    ),
    choices: ['No', 'Yes, go ahead'],
    message: `Is that ok?`,
  });

  if (!hasConfirmedCommits.correct) {
    printError(
      `The repository can't be initiated without the commits`,
      'REPO INIT',
    );
    process.exit(1);
  }

  /**
   * 1. Make sure no other file is staged
   * 2. Make 2 commits, otherwise git will make the wrong assumption the files haven't moved but have changed
   */
  await $`git reset`;

  await $spinner('first commit, only moving existing files', async () => {
    await $`git mv ./.github/README.md ./docs/after-init-setup/MAIN_BREAKPROOF_README.md`;
    await $`mkdir -p ./.github/after-init-setup`;
    await $`git mv ./.github/CODEOWNERS ./.github/after-init-setup/`;
    await $`git status --short --untracked-files=no`;
    printToTerminal(
      chalk.italic
        .bold`committing with '--no-verify', otherwise our checks will fail because CODEOWNERS file is missing`,
    );
    await $`git commit --no-verify -m 'ci: move the repo README to make space for the clone main README'`;
  });

  await $spinner(
    'second commit, initiate the new files in their place',
    async () => {
      await $`git mv ./docs/after-init-setup/README.md .`;
      await fs.writeFile(
        './.github/CODEOWNERS',
        await renderTemplate(`CODEOWNERS.ejs`, {
          isSingleTeam,
          currentTeamName,
        }),
      );
      await $`git add ./.github/CODEOWNERS`;
      await $`git commit -m 'ci: final moving of files after clone initialization'`;
    },
  );

  await startOnboarding({ options: { initialStep: 3 } });

  return {};
};
