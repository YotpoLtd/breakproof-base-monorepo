import * as path from 'node:path';

import { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';

import {
  BabelConfigGeneratorOptions,
  getBabelConfig,
} from '@repo/babel-base-isolated';
import { SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS } from '@repo/environment';

/**
 * Any code outside the `src` directory of a project will be marked as external
 */
// @ts-expect-error We only externalize if we have the full path
export const externalizeNonSource: Required<RollupOptions>['external'] = (
  id,
  _,
  isResolved,
) => {
  if (isResolved) {
    return !id.startsWith(path.join(process.cwd(), 'src'));
  }
};

/**
 * Sane output defaults that plays nicely for building libraries in the repo
 */
export const getDefaultOutputOptions =
  (): Required<RollupOptions>['output'] => ({
    dir: 'dist',
    format: 'cjs',
    /**
     * Preserve original directory structure but in the dist folder
     * (root is directory of the top-level entry point).
     * This will still apply tree-shaking
     */
    preserveModules: true, // Keep directory structure and files
    sourcemap: true,
  });

/**
 * Base config for the `babel` plugin that plays nicely with repo concepts
 */
export const getBabelPluginConfig = (
  options: BabelConfigGeneratorOptions,
): RollupBabelInputPluginOptions => ({
  babelHelpers: 'bundled',
  extensions: SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS.map((ext) => `.${ext}`),
  ...getBabelConfig({
    ...options,
    /**
     * Libraries expect their consumers to have `core-js`, so we don't want to include it
     */
    coreJsResolutionFix: false,
  }),
});

/**
 * Base config for the `typescript` plugin that plays nicely with repo concepts
 */
export const getTypescriptPluginConfig = (): RollupTypescriptOptions => ({
  tsconfig: './tsconfig.build.json',
  noForceEmit: true,
  compilerOptions: {
    emitDeclarationOnly: true,
  },
  tslib: 'tslib',
});

export { type RollupOptions } from 'rollup';
