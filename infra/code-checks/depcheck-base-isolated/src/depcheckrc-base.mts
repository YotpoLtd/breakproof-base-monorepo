import * as fs from 'node:fs';
import * as path from 'node:path';

const packageJson = JSON.parse(
  String(fs.readFileSync(path.join(process.cwd(), 'package.json'))),
) as {
  dependencies?: Record<string, string>;
  devDependencies: Record<string, string>;
  devtoolsDependencies: Record<string, string>;
};

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
  ],
  package: {
    ...packageJson,
    ...((packageJson.dependencies || packageJson.devDependencies) && {
      dependencies: {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      },
    }),
    ...(packageJson.devtoolsDependencies && {
      devDependencies: packageJson.devtoolsDependencies,
    }),
  },
};

export default config;
