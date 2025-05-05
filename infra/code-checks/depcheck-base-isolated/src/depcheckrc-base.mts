import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const NODE_MODULES_PACKAGE_DIRS = String(
  execSync('pnpm list --depth=0 --parseable', {
    shell: 'bash',
  }),
)
  .trim()
  .split('\n');

const NODE_MODULES_PEER_DEPS = [
  ...new Set(
    NODE_MODULES_PACKAGE_DIRS.flatMap((dirPath) => {
      try {
        const packageJson = JSON.parse(
          String(fs.readFileSync(path.join(dirPath, 'package.json'))),
        ) as {
          peerDependencies?: Record<string, string>;
        };

        return packageJson.peerDependencies
          ? Object.keys(packageJson.peerDependencies)
          : [];
      } catch (e) {
        return [];
      }
    }),
  ),
];

const MINIMUM_REASON_LENGTH = 30;

export const defineIgnoredPackage = ({
  package: packageName,
  reason,
}: {
  package: string;
  reason: string;
}) => {
  if (reason.length < 10) {
    throw new Error(
      `When ignoring a package, please provide a descriptive reason longer than ${MINIMUM_REASON_LENGTH}.`,
    );
  }
  return packageName;
};

const config = {
  ignores: [
    ...NODE_MODULES_PEER_DEPS,
    defineIgnoredPackage({
      package: 'eslint',
      reason: 'Used by the code editor to run checks',
    }),
    defineIgnoredPackage({
      package: 'prettier',
      reason: 'Used by the code editor to run formatting',
    }),
    defineIgnoredPackage({
      package: '@repo/jest-base-isolated',
      reason: 'Used in scripts',
    }),
    defineIgnoredPackage({
      package: 'sucrase',
      reason: 'Used internally by ts-node to transpile the files',
    }),
    defineIgnoredPackage({
      package: 'ts-node',
      reason: 'Used internally by many tools like `jest` to execute `ts` file',
    }),
    defineIgnoredPackage({
      package: '@repo/eslint-problem-snapshotter',
      reason:
        'Used by lint-staged under the hood. We add it as dependency to make sure the linting is re-triggered when @repo/eslint-problem-snapshotter changes',
    }),
    defineIgnoredPackage({
      package: '@repo/tsc-problem-snapshotter',
      reason:
        'Used by lint-staged under the hood. We add it as dependency to make sure the linting is re-triggered when @repo/tsc-problem-snapshotter changes',
    }),
  ],
};

export default config;
