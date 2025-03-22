#!/usr/bin/env node

import { exec as execWithCallback, spawn } from 'node:child_process';
import * as path from 'node:path';
import * as util from 'node:util';

import micromatch from 'micromatch';

const exec = util.promisify(execWithCallback);

const ARGS = process.argv.slice(2);

const IS_SEQUENTIAL_ARG_NAME = '--is-sequential';

if (ARGS.length > 1 || (ARGS.length && ARGS[0] !== IS_SEQUENTIAL_ARG_NAME)) {
  throw new Error(
    `Please only provide a single argument called: ${IS_SEQUENTIAL_ARG_NAME}`,
  );
}
const IS_SEQUENTIAL = ARGS[0] === IS_SEQUENTIAL_ARG_NAME;
const SHOULD_EXIT_IF_ANY_FAIL = !process.env.LINT_AUTOFIX;

const prefixOutputLines = (outputBuffer, prefix) => {
  const lines = outputBuffer.toString().split('\n');
  lines.forEach((line) => {
    process.stdout.write(`[${prefix}] ${line} \n`);
  });
};

const runCommandsForFiles = async (
  commandPrefix,
  matchingRelativeFilePaths,
  commandsList,
) => {
  for (const command of commandsList) {
    const handleOutput = (outputBuffer) =>
      prefixOutputLines(outputBuffer, commandPrefix);

    handleOutput(`Running: ${command.userShellCommand}`);

    new Promise((resolve) => {
      const commandProcess = spawn(command.finalShellCommand, {
        shell: 'bash',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: true },
      });
      const handleMainExit = () => commandProcess.kill();
      process.on('exit', handleMainExit);

      commandProcess.on('exit', (exitCode) => {
        process.removeListener('exit', handleMainExit);
        const isExitError = Boolean(exitCode);
        if (isExitError && SHOULD_EXIT_IF_ANY_FAIL) {
          process.exit(exitCode);
        } else {
          resolve();
        }
      });

      const handleOutput = (outputBuffer) =>
        prefixOutputLines(outputBuffer, commandPrefix);
      commandProcess.stdout.on('data', handleOutput);
      commandProcess.stderr.on('data', handleOutput);
      commandProcess.stderr.on('exit', handleOutput);
    });
  }
};

const getCommandsFromLintStagedPatternConfig = (
  lintStagedPatternConfig,
  matchingRelativeFilePaths,
  appendFileNames = true,
) => {
  if (typeof lintStagedPatternConfig === 'string') {
    return getCommandsFromLintStagedPatternConfig(
      [lintStagedPatternConfig],
      matchingRelativeFilePaths,
    );
  }
  // lint-staged allows functions that accept the list of matching files, so lets account for this
  if (typeof lintStagedPatternConfig === 'function') {
    return getCommandsFromLintStagedPatternConfig(
      lintStagedPatternConfig(matchingRelativeFilePaths),
      matchingRelativeFilePaths,
      false,
    );
  }
  if (Array.isArray(lintStagedPatternConfig)) {
    return lintStagedPatternConfig.flat().map((command) => ({
      userShellCommand: command,
      finalShellCommand:
        `${command} ${appendFileNames ? matchingRelativeFilePaths.map((filename) => `'${filename}'`).join(' ') : ''}`.trim(),
    }));
  }
};

const main = async () => {
  const lintStagedConfig = (
    await import(path.resolve(process.cwd(), '.lintstagedrc.mjs'))
  ).default;
  const allProjectFiles = (
    await exec('git ls-files --cached --others --exclude-standard')
  ).stdout.split('\n');
  const patterns = Object.keys(lintStagedConfig);
  const parallelExecutionPromises = [];

  for (const globPattern of patterns) {
    /**
     * Copy lint-staged mechanism: https://github.com/lint-staged/lint-staged/blob/163112f0214444021670009c845813416c60a852/lib/generateTasks.js#L34-L42
     */
    const matchingRelativeFilePaths = micromatch(allProjectFiles, globPattern, {
      dot: true,
      // If the pattern doesn't look like a path, enable `matchBase` to
      // match against filenames in every directory. This makes `*.js`
      // match both `test.js` and `subdirectory/test.js`.
      matchBase: !globPattern.includes('/'),
      posixSlashes: true,
      strictBrackets: true,
    });
    if (!matchingRelativeFilePaths.length) {
      continue;
    }
    const commandsPromise = runCommandsForFiles(
      globPattern,
      matchingRelativeFilePaths,
      getCommandsFromLintStagedPatternConfig(
        lintStagedConfig[globPattern],
        matchingRelativeFilePaths,
      ),
    );
    if (IS_SEQUENTIAL) {
      await commandsPromise;
    } else {
      parallelExecutionPromises.push(commandsPromise);
    }
  }

  // the parallelExecutionPromises will be empty if IS_SEQUENTIAL is true
  await Promise.all(parallelExecutionPromises);
};

main();
