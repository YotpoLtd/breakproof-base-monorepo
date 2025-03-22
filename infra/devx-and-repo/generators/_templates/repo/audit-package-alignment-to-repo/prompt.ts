import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

import chalk from 'chalk';
import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import {
  getScriptsInfo,
  HELP_ACTION_PROMISE_TEXT,
  HELP_ACTION_TEXT,
  PackageType,
} from '#extra-template-vars';
import {
  getRepoRootDir,
  printCheck,
  printContactHelp,
  printError,
  printToTerminal,
} from '#helpers';
import * as sharedPrompts from '#shared-prompts';

const readPackageJson = (packageJsonFilePath: string) =>
  JSON.parse(String(fs.readFileSync(packageJsonFilePath))) as {
    name: string;
    scripts?: Record<string, string>;
  };

/**
 * Check for issues inside package.json & keep asking to be fixed until they are
 */
const checkPackageJsonIssues = async (packageJson: { name: string }) => {
  printCheck(
    chalk.blue(
      `Checking for issues in your ${chalk.green('package.json')} file`,
    ),
  );
  const eslintCommand = `pnpm --silent --filter='${packageJson.name}' exec pnpm --silent --workspace-root shared:lint:package.json`;
  try {
    execSync(`${eslintCommand}`, {
      shell: 'bash',
      stdio: 'inherit',
    });
  } catch (e) {
    printError(`We found issues with your ${chalk.redBright('package.json')}. See them above

`);
    const hasFixedPackageJsonIssues = await prompts.quiz({
      message: `Can you confirm you corrected those, so we can check for other issues?`,
      choices: ['Yep, done!', `I need some help, ${HELP_ACTION_PROMISE_TEXT}`],
      correctChoice: 0,
    });
    if (hasFixedPackageJsonIssues.correct) {
      await checkPackageJsonIssues(packageJson);
    } else {
      printContactHelp();
    }
  }
};

/**
 * Guide the developer to make sure the directory of the package is correct
 * Return that directory alongside metadata about its package.json
 */
const getValidPackageInfo = async (
  repoRootDir: string,
  initialValue?: string | undefined,
) => {
  let packageJsonFilePath: string;
  let packageJson: { name: string; scripts?: Record<string, string> };

  const packageDir = await prompts.input<string>({
    message: 'Package directory:',
    ...(initialValue && { initial: initialValue }),
    validate: (typedPackageDir) => {
      const resolvedPackageDir = path.resolve(repoRootDir, typedPackageDir);
      if (
        !fs.existsSync(resolvedPackageDir) ||
        !resolvedPackageDir.startsWith(repoRootDir)
      ) {
        return 'Such directory does not exist in the repo';
      }
      packageJsonFilePath = path.resolve(resolvedPackageDir, 'package.json');
      if (!fs.existsSync(packageJsonFilePath)) {
        return `Your package doesn't have a ${chalk.redBright('package.json')}.

  ${chalk.white('1. Create one')}
  ${chalk.white(`2. If this was a sub-directory of the original repo, pick relevant dependencies from the main ${chalk.green('package.json')} there and move them in your new file`)}
`;
      }
      packageJson = readPackageJson(packageJsonFilePath);
      try {
        execSync(
          `pnpm --filter='${packageJson.name}' --fail-if-no-match exec pwd`,
          {
            shell: 'bash',
          },
        );
      } catch (e) {
        return ` Location is not known to pnpm:

  ${chalk.white(`1. Move your package to a directory matching the patterns in ${chalk.green('pnpm-workspace.yaml')}`)}
  ${chalk.white(
    `2. Or specify a new pattern in ${chalk.green('pnpm-workspace.yaml')} to match your chosen directory`,
  )}`;
      }
      return true;
    },
  });

  return {
    packageJson: packageJson!,
    packageDir,
    packageJsonFilePath: packageJsonFilePath!,
  };
};

const checkScripts = async (
  packageJsonFilePath: string,
  requiredScriptNames: Set<string>,
  scriptInfo: Record<string, string>,
) => {
  const packageJson = readPackageJson(packageJsonFilePath);
  const availableScriptNames = new Set(Object.keys(packageJson.scripts || {}));
  const missingBuildRelatedScripts =
    requiredScriptNames.difference(availableScriptNames);

  if (missingBuildRelatedScripts.size) {
    printError(`Your package is missing some scripts from ${chalk.green('package.json')}
`);
    missingBuildRelatedScripts.forEach((scriptName: string) => {
      printToTerminal(`${chalk.bold(chalk.blueBright(scriptName))}
What it should do: ${chalk.yellow(scriptInfo[scriptName])}
`);
    });

    printToTerminal(`

${chalk.bold(chalk.magenta('For examples of what those scripts could be, take a look at'))} ${chalk.green('9_package.json.ejs.t')}

`);

    const hasFixedMissingScripts = await prompts.quiz({
      message: `Can you confirm you added those, so we can check again?`,
      choices: ['Yep, done!', `I need some help, ${HELP_ACTION_PROMISE_TEXT}`],
      correctChoice: 0,
    });
    if (hasFixedMissingScripts.correct) {
      await checkScripts(packageJsonFilePath, requiredScriptNames, scriptInfo);
    } else {
      printContactHelp();
    }
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
  printToTerminal(`
  ${chalk.blueBright('Congrats for moving your package 🎉️')}
  ${chalk.whiteBright(`Let's make sure it's configured as intended`)}

  `);

  const repoRootDir = getRepoRootDir();

  const { packageJson, packageJsonFilePath, packageDir } =
    await getValidPackageInfo(repoRootDir, cliArgs.packageDir);
  await checkPackageJsonIssues(packageJson);

  const type = await sharedPrompts.getType();
  const isSandbox = await sharedPrompts.getIsSandbox(type, cliArgs);
  const supportingForProject = await sharedPrompts.getSupportingForProject(
    type,
    cliArgs,
    isSandbox,
  );
  const hasBuild =
    type === PackageType.E2E_APP
      ? false
      : await prompts.toggle({
          message:
            'Does this package need a build process in order to be used by others?',
          enabled: 'Yes',
          disabled: 'No',
          initial: true,
        });

  const commonBuildRelatedScriptNames = [
    'dev',
    'dev:with-deps',
    'build',
    'transpile',
  ];

  const requiredScriptNames = new Set(
    [
      ...(type === PackageType.E2E_APP
        ? [
            'test',
            'test:e2e:run',
            'test:e2e:dev',
            'dev',
            'dev:with-deps',
            ...(supportingForProject
              ? ['dev:with-app', 'app:dev-for-e2e', 'app:serve']
              : []),
          ]
        : []),
      ...(hasBuild &&
      (type === PackageType.INFRA_TOOL || type === PackageType.LIB)
        ? commonBuildRelatedScriptNames
        : []),
      ...(type === PackageType.APP
        ? [
            ...(hasBuild
              ? [...commonBuildRelatedScriptNames, 'dev:serve', 'build:watch']
              : []),
            ...(supportingForProject ? ['dev:with-lib', 'dev:watch'] : []),
          ]
        : []),
    ].filter(Boolean),
  );

  const scriptInfo = getScriptsInfo(type, supportingForProject);

  await checkScripts(packageJsonFilePath, requiredScriptNames, scriptInfo);

  printToTerminal(
    chalk.whiteBright(`
  ${chalk.bold(chalk.blueBright('Next steps:'))}

  1. Go into its directory and run either ${chalk.green('pnpm install')} or ${chalk.green('pnpm import')}.
  2. If you imported subdir of repo, copy relevant config from the original repo tsconfig into multiple files at ${chalk.green(packageDir)}.
  3. Add lint to your project by running ${chalk.green(`pnpm --workspace-root generate add lint --name='${packageJson.name}' --type='${type}'`)}.
  4. [Optional] Take a look at the eslint config you had at the original repo and copy any relevant parts.
  5. Try running ${chalk.green(`pnpm --filter='${packageJson.name}' run build`)} and when/if you see missing dependencies install them.
  6. While running ${chalk.green(`pnpm --filter='${packageJson.name}' run build`)}, if you get weird errors from third party dependencies errors most likely you need to apply packageExtensions fixes, ${HELP_ACTION_TEXT}.
  7. If you moved an entire repo, think about merging its specific .github workflows into this one
  8. If your package is release-able to the npm registry, create a git tag named <package name>@<current version>
  9. If your package is release-able to the npm registry, add automatic releases by running ${chalk.green(`pnpm --workspace-root generate add release --name='${packageJson.name}' --type='${type}'`)}"

`),
  );

  return { packageJson, hasBuild };
};
