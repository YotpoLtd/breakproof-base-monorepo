import { parse as parseTsc } from '@aivenio/tsc-output-parser';

import { runSnapshotterCli } from '@repo/code-problem-snapshotter/snapshotter-cli';
import {
  CodeCheckerCliOutputParser,
  Filename,
} from '@repo/code-problem-snapshotter/types';

interface TscOutputParserItem {
  value: {
    path: {
      type: 'Path';
      value: Filename;
    };
    cursor: {
      type: 'Cursor';
      value: {
        line: number;
        col: number;
      };
    };
    tsError: {
      type: 'TsError';
      value: {
        type: 'error';
        errorString: string;
      };
    };
    message: {
      type: 'Message';
      value: string;
    };
  };
}

const parseTscToCodeProblems: CodeCheckerCliOutputParser = (tscOutput) => {
  const tscParserItems = parseTsc(tscOutput) as Array<TscOutputParserItem>;
  return tscParserItems.map((item) => ({
    filename: item.value.path.value,
    issueType: item.value.tsError.value.errorString,
    location: {
      line: item.value.cursor.value.line,
      column: item.value.cursor.value.col,
    },
    message: item.value.message.value,
  }));
};

const SNAPSHOT_FILENAME = '.tsc-problems-snapshot.json';
runSnapshotterCli(parseTscToCodeProblems, SNAPSHOT_FILENAME);
