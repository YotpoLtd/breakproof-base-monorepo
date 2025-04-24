import boxen from 'boxen';
import terminalLink from 'terminal-link';

import { printToTerminal } from '#helpers';
import { chalk } from '#zx';

/**
 * Prints a terminal-friendly repository tree preview with links and descriptions
 *
 * Generated with the help of https://tree.nathanfriend.com
 */
export const printRepoTreePreview = (repoRoot: string) => {
  printToTerminal(
    `
${terminalLink(`<repo root>`, `file://${repoRoot}`)}
  ├─ ${terminalLink(chalk.green.bold`.nodejs-versions-whitelist.cjs`, `file://${repoRoot}/.nodejs-versions-whitelist.cjs`)}
  │  ${chalk.dim.bold`↑ `}${chalk.italic`Defines an array of allowed \`node.js\` versions`}
  │
  ├─ ${terminalLink(chalk.green.bold`.npmrc`, `file://${repoRoot}/.npmrc`)}
  │  ${chalk.dim.bold`↑ `}${chalk.italic`The \`use-node-version\` property inside defines the default node.js version`}
  │
  ├─ ${terminalLink(chalk.green.bold`.npm-scopes-whitelist.cjs`, `file://${repoRoot}/.npm-scopes-whitelist.cjs`)}
  │  ${chalk.dim.bold`↑ `}${chalk.italic`Defines an array of allowed \`npm\` scopes for the names of your packages`}
  │
  └─ ${terminalLink(`infra${chalk.dim`/`}`, `file://${repoRoot}/infra`)}
      ├─ ${terminalLink(`code-checks${chalk.dim`/`}`, `file://${repoRoot}/infra/code-checks`)}
      │   ├─ ${terminalLink(chalk.green.bold`eslint-base-isolated/src/**`, `file://${repoRoot}/infra/code-checks/eslint-base-isolated/src`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`\`eslint\` base configs${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#eslint--plugins')} take a look at the import-order rule, where you should define your npm scopes`}
      │   │
      │   └─ ...${terminalLink(chalk.italic`more code checking tools`, `file://${repoRoot}/infra/code-checks`)}
      │
      ├─ ${terminalLink(`release${chalk.dim`/`}`, `file://${repoRoot}/infra/release`)}
      │   ├─ ${terminalLink(chalk.green.bold`release-it-base-isolated/**`, `file://${repoRoot}/infra/release/release-it-base-isolated`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`\`release-it\` base configs${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#realease-it')}`}
      │   │
      │   └─ ${terminalLink(chalk.green.bold`conventional-changelog-preset/src/**`, `file://${repoRoot}/infra/release/conventional-changelog-preset/src`)}
      │      ${chalk.dim.bold`↑ `}${chalk.italic`\`conventional-changelog\` config used by \`release-it\`${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#conventional-changelog')}`}
      │
      ├─ ${terminalLink(`build${chalk.dim`/`}`, `file://${repoRoot}/infra/build`)}
      │   ├─ ${terminalLink(chalk.green.bold`environment/src/index.ts`, `file://${repoRoot}/infra/build/environment/src/index.ts`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`Defines target browsers as browserlist queries`}
      │   │
      │   ├─ ${terminalLink(chalk.green.bold`typescript-base-isolated/**`, `file://${repoRoot}/infra/build/typescript-base-isolated`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`base \`tsconfig\` configs & shortcut to \`tsx\` cli${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#typescript')}`}
      │   │
      │   ├─ ${terminalLink(chalk.green.bold`rollup-base-isolated/src/**`, `file://${repoRoot}/infra/build/rollup-base-isolated`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`base \`rollup\` configs${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#rollup')}`}
      │   │
      │   ├─ ${terminalLink(chalk.green.bold`babel-base-isolated/src/**`, `file://${repoRoot}/infra/build/babel-base-isolated`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`base \`babel\` configs${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#babel--plugins')}`}
      │   │
      │   └─ ...${terminalLink(chalk.italic`more build tools`, `file://${repoRoot}/infra/build`)}
      │
      ├─ ${terminalLink(`test${chalk.dim`/`}`, `file://${repoRoot}/infra/test`)}
      │   ├─ ${terminalLink(chalk.green.bold`cypress-base-isolated/src/**`, `file://${repoRoot}/infra/test/cypress-base-isolated/src`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`\`cypress\` base configs${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#cypress')}`}
      │   │
      │   ├─ ${terminalLink(chalk.green.bold`jest-base-isolated/src/**`, `file://${repoRoot}/infra/test/jest/src`)}
      │   │  ${chalk.dim.bold`↑ `}${chalk.italic`\`jest\` base configs${terminalLink(`@see summary`, 'https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/docs/tools-details.md#jest')}`}
      │   │
      │   └─ ...${terminalLink(chalk.italic`more test tools`, `file://${repoRoot}/infra/test`)}
      │
      └─ ${terminalLink(`devx-and-repo${chalk.dim`/`}`, `file://${repoRoot}/infra/devx-and-repo`)}
          ├─ generators/
          │   ├─ ${terminalLink(chalk.green.bold`extra-template-vars.ts`, `file://${repoRoot}/infra/devx-and-repo/generators/extra-template-vars.ts`)}
          │   │  ${chalk.dim.bold`↑ `}${chalk.italic`Some constants used during code generation & CLI guides, e.g. text you want to output for help`}
          │   │
          │   └─ ${terminalLink(chalk.green.bold`_templates/package/new/**`, `file://${repoRoot}/infra/devx-and-repo/generators/_templates/package/new`)}
          │      ${chalk.dim.bold`↑ `}${chalk.italic`The templates that \`hygen\` uses to generate files of your new projects. versions for your projects`}
          │
          └─ ...${terminalLink(chalk.italic`more devx and repo tools`, `file://${repoRoot}/infra/devx-and-repo`)}
          
${boxen(
  chalk.bold.black(`↑ See the structure of files & tools ↑
${chalk.dim.italic('You probably need to scroll up to see the beginning')} `),
  {
    padding: 1,
    margin: 1,
    backgroundColor: 'greenBright',
    borderStyle: 'none',
  },
)}`,
  );
};
