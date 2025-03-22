import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import jsonStableStringify from 'json-stable-stringify';
import * as prettier from 'prettier';

import { CodeProblem, CodeProblemsSnapshot, Filename } from './types';

export const getSnapshotFilePath = (snapshotFilename: Filename) =>
  path.resolve(process.cwd(), snapshotFilename);

/**
 * Based on a list of file problems, create a snapshot object ready to be written
 */
export const getSnapshotFromCodeProblems = (codeProblems: Array<CodeProblem>) =>
  codeProblems.reduce<CodeProblemsSnapshot>(
    (partialSnapshot, { filename, issueType }) => {
      partialSnapshot[filename] = partialSnapshot[filename] || [];
      const codeProblemSummaryList = partialSnapshot[filename]!;

      const codeProblemSummary = codeProblemSummaryList.find(
        (aFleProblemSummary) => aFleProblemSummary.issueType === issueType,
      );

      if (codeProblemSummary) {
        codeProblemSummary.count++;
      } else {
        codeProblemSummaryList.push({
          issueType,
          count: 1,
        });
      }

      return partialSnapshot;
    },
    {},
  );

/**
 * Write the snapshot object to disk
 */
export const writeSnapshot = async (
  snapshot: CodeProblemsSnapshot,
  snapshotFilename: Filename,
) => {
  const snapshotFilePath = getSnapshotFilePath(snapshotFilename);
  const prettierOptions = await prettier.resolveConfig(snapshotFilePath);

  if (!prettierOptions) {
    throw new Error(
      'No prettier config found! Can you double check it exists?',
    );
  }

  fs.writeFileSync(
    snapshotFilePath,
    await prettier.format(jsonStableStringify(snapshot)!, {
      ...prettierOptions,
      filepath: snapshotFilePath,
    }),
  );
};

/**
 * Read the snapshot file
 */
export const getKnownProblemsSnapshot = (snapshotFilename: Filename) => {
  const snapshotFilePath = getSnapshotFilePath(snapshotFilename);

  return (
    fs.existsSync(snapshotFilePath)
      ? JSON.parse(
          fs.readFileSync(getSnapshotFilePath(snapshotFilename), 'utf-8'),
        )
      : {}
  ) as CodeProblemsSnapshot;
};

/**
 * Get a snapshot of the new problems only
 */
export const getOnlyNewProblemsSnapshot = (
  knownProblemsSnapshot: CodeProblemsSnapshot,
  allCurrentCodeProblems: Array<CodeProblem>,
) => {
  const allCurrentProblemsSnapshot = getSnapshotFromCodeProblems(
    allCurrentCodeProblems,
  );

  return Object.entries(
    allCurrentProblemsSnapshot,
  ).reduce<CodeProblemsSnapshot>(
    (snapshot, [filename, codeProblemSummaryList]) => {
      const newCodeProblemSummaryList = codeProblemSummaryList.filter(
        (newProblemSummary) => {
          const matchingKnownProblemSummary = knownProblemsSnapshot[
            filename
          ]?.find(
            (knownProblemSummary) =>
              knownProblemSummary.issueType === newProblemSummary.issueType,
          );

          return (
            !matchingKnownProblemSummary ||
            matchingKnownProblemSummary.count < newProblemSummary.count
          );
        },
      );
      if (newCodeProblemSummaryList.length) {
        snapshot[filename] = newCodeProblemSummaryList;
      }

      return snapshot;
    },
    {},
  );
};

/**
 * What developers will see in the console for new problems
 */
export const printNewProblems = async (
  knownProblemsSnapshot: CodeProblemsSnapshot,
  onlyNewProblemsSnapshot: CodeProblemsSnapshot,
  allCurrentCodeProblems: Array<CodeProblem>,
) => {
  const chalk = (await import('chalk')).default;
  Object.entries(onlyNewProblemsSnapshot).forEach(
    ([filename, codeProblemSummaryList]) => {
      // eslint-disable-next-line no-console -- logging is on purpose
      console.error(`
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
📁 ${filename}`);

      codeProblemSummaryList.forEach((problemSummary) => {
        const allCurrentCodeProblemsOfType = allCurrentCodeProblems.filter(
          (problem) =>
            problem.filename === filename &&
            problem.issueType === problemSummary.issueType,
        );

        const numberOfNewProblems =
          allCurrentCodeProblemsOfType.length -
          (knownProblemsSnapshot[filename]?.find(
            (knownProblemSummary) =>
              knownProblemSummary.issueType === problemSummary.issueType,
          )?.count || 0);

        const hasAnyProblemBeenSnapshotted =
          allCurrentCodeProblemsOfType.length > 0 &&
          numberOfNewProblems !== allCurrentCodeProblemsOfType.length;
        const defaultErrorSeparator = chalk.underline('or');
        const errorPrefix = `\n${defaultErrorSeparator} ${chalk.bold(chalk.red('✘'))} `;
        // eslint-disable-next-line no-console -- logging is on purpose
        console.error(
          `
🐛 ${chalk.bold(`NEW`)} ${chalk.red(`"${problemSummary.issueType}"`)} error${numberOfNewProblems > 1 ? 's' : ''}.${
            hasAnyProblemBeenSnapshotted
              ? `
   ${chalk.bold(`YOU CAN FIX ONLY ${numberOfNewProblems}`)} from the following ${allCurrentCodeProblemsOfType.length}:
   ${chalk.italic(chalk.dim('(of course, if you can, fix all of them)'))}`
              : `
   ${chalk.bold(`YOU MUST FIX ${numberOfNewProblems > 1 ? `ALL ${numberOfNewProblems}` : 'IT'}`)} ${numberOfNewProblems > 1 ? `of them` : ''}`
          }${errorPrefix.replace(defaultErrorSeparator, '  ')}${allCurrentCodeProblemsOfType
            .map(
              (problem) =>
                `${problem.location.line}:${problem.location.column} — ${problem.message}`,
            )
            .join(
              hasAnyProblemBeenSnapshotted
                ? errorPrefix
                : errorPrefix.replace(defaultErrorSeparator, '  '),
            )}`,
        );
      });
    },
  );
};
