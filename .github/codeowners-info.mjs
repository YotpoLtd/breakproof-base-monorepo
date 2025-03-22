import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import micromatch from 'micromatch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT_DIR = path.dirname(__dirname);

export const getCodeownersRules = async () => {
  const codeownersFileContents = String(
    await fsPromises.readFile(`${__dirname}/CODEOWNERS`),
  );

  return codeownersFileContents
    .split('\n')
    .map((line) => {
      const lineCleaned = line.trim();
      if (!lineCleaned || lineCleaned.startsWith('#')) {
        return false;
      } else {
        const [pattern, owner] = lineCleaned.split(' ');
        return {
          pattern: pattern.trim(),
          owner: owner.trim(),
        };
      }
    })
    .filter(Boolean);
};

export const getFileOwnershipInfo = async (
  absoluteFilePaths,
  codeOwnerRules,
) => {
  const filesWithPathsStartingFromRootDir = absoluteFilePaths.map((filePath) =>
    filePath.replace(REPO_ROOT_DIR, ''),
  );
  const ownershipPerFile = codeOwnerRules
    .toReversed()
    .reduce((ownershipPerFilePartial, ownershipRule) => {
      const rulePatterns = [ownershipRule.pattern];
      if (!ownershipRule.pattern.includes('*')) {
        rulePatterns.push(`${ownershipRule.pattern}/**`);
      }
      /**
       * Copy lint-staged mechanism: https://github.com/lint-staged/lint-staged/blob/163112f0214444021670009c845813416c60a852/lib/generateTasks.js#L34-L42
       */
      const matchingFiles = micromatch(
        filesWithPathsStartingFromRootDir,
        rulePatterns,
        {
          dot: true,
          // If the pattern doesn't look like a path, enable `matchBase` to
          // match against filenames in every directory. This makes `*.js`
          // match both `test.js` and `subdirectory/test.js`.
          matchBase: !ownershipRule.pattern.includes('/'),
          posixSlashes: true,
          strictBrackets: true,
        },
      );
      matchingFiles.forEach((matchingFile) => {
        ownershipPerFilePartial[matchingFile] = ownershipRule.owner;
      });
      return ownershipPerFilePartial;
    }, {});

  const filesWithoutOwner = new Set(
    filesWithPathsStartingFromRootDir,
  ).difference(new Set(Object.keys(ownershipPerFile)));

  return {
    ownershipPerFile,
    filesWithoutOwner,
  };
};
