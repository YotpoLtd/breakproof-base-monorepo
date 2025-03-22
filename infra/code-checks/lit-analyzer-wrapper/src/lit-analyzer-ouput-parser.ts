import markdownit from 'markdown-it';

import { CodeProblem } from '@repo/code-problem-snapshotter/types';

type LitAnalyzerCliMarkdownOutput = string;

enum KnownMarkdownTokenType {
  TD_OPEN = 'td_open',
  TD_INLINE = 'inline',
  TR_CLOSE = 'tr_close',
}

const md = markdownit();

/**
 * Parse string such as:
 *
 * | Line | Column | Type    | Rule                          | Message                                          |
 * |------|--------|---------|-------------------------------|--------------------------------------------------|
 * | 85   | 17     | `error-or-smth-else` | rule-name-here           | Message  here               |
 *
 * to code problem objects.
 */
const parseLitMarkdownTableToCodeProblems = (
  markdownTableStr: string,
  filename: string,
): Array<CodeProblem> => {
  const mdTableTokens = md.parse(markdownTableStr, {});
  const mdTableDataTokens = mdTableTokens.slice(
    mdTableTokens.findIndex((el) => el.type === 'tbody_open'),
  );

  const rows: Array<[string, string, string, string, string]> = [];
  let currentRow: Array<string> | null;

  mdTableDataTokens.forEach((token) => {
    if (!currentRow && token.type === KnownMarkdownTokenType.TD_OPEN) {
      currentRow = [];
    } else if (currentRow && token.type === KnownMarkdownTokenType.TD_INLINE) {
      currentRow.push(token.content);
      // eslint-disable-next-line sonarjs/elseif-without-else -- we don't care about other scenarios
    } else if (currentRow && token.type === KnownMarkdownTokenType.TR_CLOSE) {
      rows.push(currentRow as [string, string, string, string, string]);
      currentRow = null;
    }
  });

  return rows.map((problemData) => ({
    filename: filename.trim(),
    issueType: problemData[3],
    location: {
      line: Number(problemData[0]),
      column: Number(problemData[1]),
    },
    message: problemData[4],
  }));
};

/**
 * This is intended to consume the output of `lit-analyze` CLI command
 * and parse it to an array of CodeProblem items.
 *
 * For this to work must be executed with the `--format markdown` option,
 * i.e. `lit-analyze --format markdown`
 */
export const getCodeProblemListFromLitAnalyzerOutput = (
  litAnalyzerOutput: LitAnalyzerCliMarkdownOutput,
): Array<CodeProblem> => {
  const outputSections = litAnalyzerOutput.split('## ');

  return outputSections
    .filter((section) => section.trim().startsWith('./'))
    .flatMap((fileSection) => {
      const firstNewLinePosition = fileSection.indexOf('\n');
      return parseLitMarkdownTableToCodeProblems(
        fileSection.slice(firstNewLinePosition).trim(),
        fileSection.slice(0, firstNewLinePosition).trim(),
      );
    });
};
