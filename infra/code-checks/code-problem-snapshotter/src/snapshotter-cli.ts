import * as process from 'node:process';

import nopt from '@pnpm/nopt';

import {
  getKnownProblemsSnapshot,
  getOnlyNewProblemsSnapshot,
  getSnapshotFromCodeProblems,
  printNewProblems,
  writeSnapshot,
} from './snapshot';
import { CodeCheckerCliOutputParser } from './types';

const CLI_OPTIONS_CONFIG = {
  ['snapshot-filename']: String,
};

const cliOptions = nopt(CLI_OPTIONS_CONFIG);

export const getSnapshotFilename = (snapshotSnapshotFilename: string): string =>
  (cliOptions['snapshot-filename'] as string) || snapshotSnapshotFilename;

/**
 * Works around: https://github.com/pnpm/pnpm/issues/9563
 */
const cleanInput = (inputString: string) =>
  inputString
    .split('\n')
    .filter(
      (line) =>
        !line.startsWith('::group::') && !line.startsWith('::endgroup::'),
    )
    .join('\n');

/**
 * The main job of this package is to provide reusable CLI functionality to others.
 *
 * This is the function that does that.
 */
export const runSnapshotterCli = (
  codeCheckerCliOutputParser: CodeCheckerCliOutputParser,
  snapshotFilename: string,
) => {
  // GET THE FIRST CLI ARGUMENT
  // eslint-disable-next-line @typescript-eslint/naming-convention -- This is almost module-level
  const FIRST_USER_CLI_ARGUMENT = process.argv[2];

  // READ ENTIRE STDIN & START SCRIPT
  let pipedInput = '';
  process.stdin.on('data', (chunk) => {
    pipedInput += chunk;
  });

  process.stdin.on('end', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- This is almost module-level
    const CURRENT_CODE_PROBLEMS = codeCheckerCliOutputParser(
      cleanInput(pipedInput),
    );

    switch (FIRST_USER_CLI_ARGUMENT) {
      case 'check-new-problems': {
        const knownProblemsSnapshot =
          getKnownProblemsSnapshot(snapshotFilename);
        const onlyNewProblemsSnapshot = getOnlyNewProblemsSnapshot(
          knownProblemsSnapshot,
          CURRENT_CODE_PROBLEMS,
        );

        if (Object.keys(onlyNewProblemsSnapshot).length > 0) {
          printNewProblems(
            knownProblemsSnapshot,
            onlyNewProblemsSnapshot,
            CURRENT_CODE_PROBLEMS,
          ).finally(() => {
            process.exit(1);
          });
        } else {
          // eslint-disable-next-line no-console -- logging is on purpose
          console.log('No new problems found!');
        }

        break;
      }
      case 'remember-existing-problems': {
        void writeSnapshot(
          getSnapshotFromCodeProblems(CURRENT_CODE_PROBLEMS),
          snapshotFilename,
        );
        break;
      }
    }
  });

  // Start listening for piped input
  process.stdin.resume();
};
