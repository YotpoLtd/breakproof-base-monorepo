import chalk from 'chalk';
import prompts from 'enquirer';
import terminalLink from 'terminal-link';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { getRepoRootDir, printToTerminal } from '#helpers';
import {
  COMMON_DEVELOPER_QUIZ_OPTIONS,
  createDeveloperQuizOptions,
  createQuizStepHeader,
} from '#shared-prompts';

import { applyJetBrainsRecommendations } from './code-editor/jetbrains';
import { printHelpForOtherEditors } from './code-editor/other';
import { applyVsCodeRecommendations } from './code-editor/vscode';

enum CodeEditor {
  JETBRAINS = 'JetBrains IDE (IDEA/PHPStorm/Webstorm/...)',
  VSCODE = 'VSCode or derivative (Cursor, WindSurf, VSCodium)',
  OTHER = 'Other',
}

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async () => {
  let stepNum = 0;
  const actionListItems: Array<{
    step: number;
    actionText: string;
    done: boolean;
  }> = [];

  // generated via https://textfancy.com/text-art/
  printToTerminal(
    chalk.blueBright(`
  👋 Welcome to: 
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▀█ ▄▄▀█ ▄▄█ ▄▄▀█ █▀█▀▄▄▀█ ▄▄▀█▀▄▄▀█▀▄▄▀█ ▄▄███ ▄▄▀█ ▄▄█▀▄▄▀█▀▄▄▀█
█ ▄▄▀█ ▀▀▄█ ▄▄█ ▀▀ █ ▄▀█ ▀▀ █ ▀▀▄█ ██ █ ██ █ ▄████ ▀▀▄█ ▄▄█ ▀▀ █ ██ █
█▄▄▄▄█▄█▄▄█▄▄▄█▄██▄█▄█▄█ ████▄█▄▄██▄▄███▄▄██▄█████▄█▄▄█▄▄▄█ █████▄▄██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`),
  );

  /**
   * pnpm --filter=devtools... install
   */
  stepNum++;
  const hasInstalledDevtools = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      stepNum,
      `
 ${chalk.yellow(`Running \`${chalk.green('pnpm --filter=devtools... install')}\` is required for local development & after updating your branch`)}`,
    ),
    message: `Confirm this was executed and didn't fail`,
    choices: createDeveloperQuizOptions({
      yes: 'Ok, done AND I will also rerun after updating my branches',
    }),
  });
  actionListItems.push({
    step: stepNum,
    actionText: hasInstalledDevtools.selectedAnswer,
    done: hasInstalledDevtools.correct,
  });

  /**
   * CODE EDITOR INTEGRATION
   */
  stepNum++;
  printToTerminal(
    createQuizStepHeader(
      2,
      `${chalk.yellow(`Correctly working code editors & IDEs are important for productive development`)}
 ${chalk.green(`Let's configure yours!`)}`,
    ),
  );
  const codeEditor = await prompts.autocomplete({
    message: `What are you using?`,
    choices: Object.values(CodeEditor),
  });
  const repoRootDir = getRepoRootDir();

  if (codeEditor === CodeEditor.JETBRAINS) {
    await applyJetBrainsRecommendations(repoRootDir);
    await prompts.quiz({
      ...COMMON_DEVELOPER_QUIZ_OPTIONS,
      prefix: `${chalk.yellow(
        `Now, open your IDE and it will ask you to install the required plugins ${terminalLink(
          '(see <repo root>/docs/JetBrains-required-plugins-example-popup.png)',
          `file://${repoRootDir}/docs/JetBrains-required-plugins-example-popup.png`,
        )}`,
      )}`,
      message: `
Click "Install required plugins" and after this is complete, come back here`,
      choices: createDeveloperQuizOptions(),
    });
    await prompts.quiz({
      ...COMMON_DEVELOPER_QUIZ_OPTIONS,
      prefix: `${chalk.yellow(`Open the ".prettierrc.mjs" of the project you are working on.`)}`,
      message: `
Having this file opened, first press "Shift" twice, then type "Apply Prettier Code Style Rules" and select it`,
      choices: createDeveloperQuizOptions(),
    });
    actionListItems.push({
      step: stepNum,
      actionText: `Code editor integration applied automatically!`,
      done: true,
    });
  } else if (codeEditor === CodeEditor.VSCODE) {
    await applyVsCodeRecommendations(repoRootDir);
    const willAcceptVSCodeSettings = await prompts.quiz({
      ...COMMON_DEVELOPER_QUIZ_OPTIONS,
      prefix: `${chalk.yellow(`The first time you open a file in the repo VSCode ask you to accept the settings.`)}`,
      message: `
Make sure you accept the prompts that appear at the lower right`,
      choices: createDeveloperQuizOptions({
        yes: 'Sure, will keep an eye for that!',
      }),
    });
    actionListItems.push({
      step: stepNum,
      actionText: `VSCode prompts: ${willAcceptVSCodeSettings.selectedAnswer}`,
      done: willAcceptVSCodeSettings.correct,
    });
  } else {
    printHelpForOtherEditors(repoRootDir);
    actionListItems.push({
      step: stepNum,
      actionText:
        'No automatic code editor integration. Check manual instructions',
      done: false,
    });
  }

  /**
   * CODEOWNERS MAINTENANCE
   */
  stepNum++;
  const willAddCodeowners = await prompts.quiz({
    ...COMMON_DEVELOPER_QUIZ_OPTIONS,
    prefix: createQuizStepHeader(
      3,
      `
 ${chalk.yellow('`<repo root>/.github/CODEOWNERS` is very important and when creating a new library you need to add a line there for your team')}`,
    ),
    message: `Confirm you are ok maintaining CODEOWNERS correct`,
    choices: createDeveloperQuizOptions({
      yes: 'Yes, I will keep the CODEOWNERS file in sync with my projects!',
    }),
  });
  actionListItems.push({
    step: stepNum,
    actionText: willAddCodeowners.selectedAnswer,
    done: willAddCodeowners.correct,
  });

  printToTerminal(`

------------------
${chalk.blueBright(`
  📋️ ${chalk.bold('You action item list:')}

${actionListItems
  .map(
    ({ done, actionText, step }) =>
      `  ${done ? '✅️' : '❌️'} Step ${step}: ${actionText.trim()}`,
  )
  .join('\n')}

`)}
  `);

  return {
    hasInstalledDevtools,
    codeEditor,
    willAddCodeowners,
  };
};
