import chalk from 'chalk';
import terminalLink from 'terminal-link';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { printError, printToTerminal } from '#helpers';

export const printHelpForOtherEditors = (repoRootDir: string) => {
  printError(
    `We don't have automatic setup or instructions for your code editor`,
    'MISSING INTEGRATION',
  );
  printToTerminal(
    chalk.blueBright(`
  You can see the manual instructions for VSCode or JetBrains and adjust them for your editor.
  The instructions for manual code editor integrations are located at:
  ${terminalLink(
    chalk.green(`<repo root>/docs/manual-code-editor-configuration.md`),
    `file://${repoRootDir}/docs/manual-code-editor-configuration.md`,
  )}

  It would be appreciated if you document the steps you take at the same place.`),
  );
};
