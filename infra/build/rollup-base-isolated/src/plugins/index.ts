import { createRequire } from 'node:module';
import * as path from 'node:path';

import typescriptPluginOriginal, {
  RollupTypescriptOptions,
} from '@rollup/plugin-typescript';
import { Plugin } from 'rollup';
export { babel } from '@rollup/plugin-babel';
export { default as commonjs } from '@rollup/plugin-commonjs';
export { default as resolve } from '@rollup/plugin-node-resolve';

/**
 * Fixes over the official `@rollup/plugin-typescript`:
 *
 * 1. has problems with type definition so we cast-to-fix
 * 2. official plugin does not use the TS from the package by default
 *
 * @see https://github.com/rollup/plugins/issues/1662
 */
export const typescript: (
  options: RollupTypescriptOptions,
) => Promise<Plugin> = async (tsPluginOptions) => {
  const currentPackageManifestPath = path.join(process.cwd(), 'package.json');

  const currentPackageTypescript = (
    (await import(
      createRequire(currentPackageManifestPath).resolve('typescript')
    )) as { default: RollupTypescriptOptions['typescript'] }
  ).default;

  // @ts-expect-error -- TS2349: This expression is not callable is bug in TypeScript itself https://github.com/microsoft/TypeScript/issues/54593
  return typescriptPluginOriginal({
    ...tsPluginOptions,
    typescript: currentPackageTypescript,
  }) as Promise<Plugin>;
};

export * from './typescriptCleanOnErrorPlugin.js';
