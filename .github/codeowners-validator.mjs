import { exec as execWithCallback } from 'node:child_process';
import * as path from 'node:path';
import * as util from 'node:util';

import {
  getCodeownersRules,
  getFileOwnershipInfo,
} from './codeowners-info.mjs';

const exec = util.promisify(execWithCallback);

const PACKAGE_DIR = process.cwd();

export const getAllGitFilesInCurrentDir = async () =>
  (
    await exec(`git ls-files --cached --others --exclude-standard`)
  ).stdout.split('\n');

const removeSlashPrefix = (filePath) => filePath.slice(1);

const [ALL_GIT_FILES_IN_CURRENT_DIR, CODEOWNERS_RULES] = await Promise.all([
  getAllGitFilesInCurrentDir(),
  getCodeownersRules(),
]);

const { filesWithoutOwner } = await getFileOwnershipInfo(
  ALL_GIT_FILES_IN_CURRENT_DIR.map((filePath) =>
    path.join(PACKAGE_DIR, filePath),
  ),
  CODEOWNERS_RULES,
);

if (filesWithoutOwner.size) {
  // eslint-disable-next-line no-console -- Intentionally print to terminal
  console.error(
    `❌️ There are files in your package that doesn't have defined owner in \`<repo root>/.github/CODEOWNERS\`:`,
  );
  [...filesWithoutOwner].forEach((filePath) =>
    // eslint-disable-next-line no-console -- Intentionally print to terminal
    console.error(removeSlashPrefix(` - ${filePath}`)),
  );
  process.exit(1);
} else {
  // eslint-disable-next-line no-console -- Intentionally print to terminal
  console.log(
    'All your project files have a defined owner in `<repo root>/.github/CODEOWNERS`!',
  );
}
