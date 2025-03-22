import { execSync } from 'node:child_process';
import * as path from 'node:path';

import chalk from 'chalk';
import yargsUnparse from 'yargs-unparser';

import {
  CONTACT_HELP_URL,
  getPackages,
  InfraToolSubtype,
  PackageType,
  REPO_DIR_BY_PKG_TYPE,
} from './extra-template-vars';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Mimicking a constant on purpose
let REPO_ROOT_DIR: string;
export const getRepoRootDir = () => {
  if (!REPO_ROOT_DIR) {
    REPO_ROOT_DIR = String(
      execSync(`pnpm --workspace-root exec pwd`, {
        shell: 'bash',
      }),
    ).trim();
  }
  return REPO_ROOT_DIR;
};

export const getDestinationByType = ({
  type,
  subtype,
  name,
}: {
  type: PackageType;
  subtype?: InfraToolSubtype | undefined;
  name: string;
}) => {
  const baseDir = REPO_DIR_BY_PKG_TYPE[type];
  return path.resolve(
    REPO_ROOT_DIR,
    `${typeof baseDir === 'string' ? baseDir : baseDir[subtype as InfraToolSubtype]}/${name}`,
  );
};

export const getPackageDir = (pkgName: string) =>
  getPackages().find((pkg) => pkg.name === pkgName)?.path;

export const stringifyArguments = (parsedArgs: Record<string, unknown>) => {
  // @ts-expect-error -- Wrong types in yargs-unparser
  const unparsed = yargsUnparse(parsedArgs);
  return unparsed.map((a) => `'${a}'`).join(' ');
};

// eslint-disable-next-line no-console -- Aliasing console to another function for semantic usage
export const printToTerminal = console.log.bind(console);
/**
 * Helper to output progress info
 */
export const printCheck = (checkDescription: string) =>
  printToTerminal(
    chalk.blue(
      chalk.italic(`
...${checkDescription}
`),
    ),
  );

/**
 * Helper to output error info
 */
export const printError = (err: string, prefix = 'PACKAGE PROBLEM') => {
  printToTerminal(`
${chalk.bgRed(chalk.whiteBright(`${prefix}:`))} ${chalk.red(err)}`);
};

export const printContactHelp = () => {
  printToTerminal(`
  ⬇   ⬇   ⬇   ⬇   ⬇   ⬇   ⬇   ⬇   ⬇   ⬇   ⬇   ⬇
  
   🤙️ ${chalk.underline(chalk.blue(CONTACT_HELP_URL))} [CMD+Click]
  
  ⬆   ⬆   ⬆   ⬆   ⬆   ⬆   ⬆   ⬆   ⬆   ⬆   ⬆   ⬆
  --------------
`);
  process.exit(1);
};
