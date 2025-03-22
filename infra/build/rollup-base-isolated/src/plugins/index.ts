import typescriptPluginOriginal, {
  RollupTypescriptOptions,
} from '@rollup/plugin-typescript';
import { Plugin } from 'rollup';
export { babel } from '@rollup/plugin-babel';
export { default as commonjs } from '@rollup/plugin-commonjs';
export { default as resolve } from '@rollup/plugin-node-resolve';

/**
 * `@rollup/plugin-typescript` has problems with type definition so we cast-to-fix
 * @see https://github.com/rollup/plugins/issues/1662
 */
export const typescript = typescriptPluginOriginal as unknown as (
  options: RollupTypescriptOptions,
) => Plugin;

export * from './typescriptCleanOnErrorPlugin.js';
