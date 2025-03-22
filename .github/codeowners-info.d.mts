interface CodeownersRule {
  pattern: string;
  owner: string;
}

export declare const getCodeownersRules: () => Promise<Array<CodeownersRule>>;

export declare const getFileOwnershipInfo: (
  filesWithPathsStartingFromRootDir: Array<string>,
  codeownersRules: Array<CodeownersRule>,
) => Promise<{
  ownershipPerFile: {
    [file: string]: string;
  };
  filesWithoutOwner: Set<string>;
}>;
