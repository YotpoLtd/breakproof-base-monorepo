/**
 * This file only exists so that `pnpmfile-helper.cjs` can be imported from TS files
 * without hacky ignoring of types or casting
 */
declare const pnpmHelpers: {
  getPnpmPackages: () => Array<{
    name: string;
    path: string;
    version: string;
  }>;
};

export default pnpmHelpers;
