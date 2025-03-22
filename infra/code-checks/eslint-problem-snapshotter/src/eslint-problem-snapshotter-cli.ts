import * as path from 'node:path';

import { runSnapshotterCli } from '@repo/code-problem-snapshotter/snapshotter-cli';
import {
  CodeCheckerCliOutputParser,
  Filename,
} from '@repo/code-problem-snapshotter/types';

enum EslintMessageSeverity {
  ERROR = 2,
  WARNING = 1,
}

interface EslintJsonOutputItem {
  filePath: Filename;
  messages: Array<{
    ruleId: string;
    severity: EslintMessageSeverity;
    message: string;
    line: number;
    column: number;
  }>;
}

const parseEslintToCodeProblems: CodeCheckerCliOutputParser = (
  eslintJsonOutput,
) => {
  const json = JSON.parse(eslintJsonOutput) as Array<EslintJsonOutputItem>;

  return json.flatMap((eslintOutputItem) =>
    eslintOutputItem.messages
      .filter(
        (eslintMessage) =>
          eslintMessage.severity === EslintMessageSeverity.ERROR,
      )
      .map((eslintMessage) => ({
        filename: path.relative(process.cwd(), eslintOutputItem.filePath),
        issueType: eslintMessage.ruleId,
        location: {
          line: eslintMessage.line,
          column: eslintMessage.column,
        },
        message: eslintMessage.message,
      })),
  );
};

const SNAPSHOT_FILENAME = '.eslint-problems-snapshot.json';
runSnapshotterCli(parseEslintToCodeProblems, SNAPSHOT_FILENAME);
