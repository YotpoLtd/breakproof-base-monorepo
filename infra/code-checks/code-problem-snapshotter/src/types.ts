export type Filename = string;

export interface CodeProblem {
  filename: Filename;
  issueType: string;
  location: {
    line: number;
    column: number;
  };
  message: string;
}

export interface FileProblemSummary extends Pick<CodeProblem, 'issueType'> {
  count: number;
}

export interface CodeProblemsSnapshot {
  [filename: Filename]: Array<FileProblemSummary>;
}

export type CodeCheckerCliOutputParser = (
  codeCheckerCliOutput: string,
) => Array<CodeProblem>;
