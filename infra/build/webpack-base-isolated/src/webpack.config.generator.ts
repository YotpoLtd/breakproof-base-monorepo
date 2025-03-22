import * as fs from 'node:fs';
import * as path from 'node:path';

import moduleAlias from 'module-alias';

import {
  BabelConfigGeneratorOptions,
  getBabelConfig,
  SupportedBabelOptions,
} from '@repo/babel-base-isolated';
import { SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS } from '@repo/environment';

/**
 * We use `babel-loader` package here, which internally uses `@babel-core`.
 *
 * HOWEVER, we don't want to install `@babel/core` locally since we want to
 * isolate it inside @repo/babel-base-isolated.
 *
 * So we alias it to point there.
 */
moduleAlias.addAliases({
  '@babel/core': fs.realpathSync(
    path.join(
      __dirname,
      '../node_modules/@repo/babel-base-isolated/node_modules/@babel/core',
    ),
  ),
});

/**
 * There are not published types for the `babel-loader`
 */
interface BabelLoaderOptions extends SupportedBabelOptions {
  sourceMap: boolean;
  cacheDirectory: boolean;
  cacheCompression: boolean;
}

export const getWebpackBabelLoaderConfig = (
  options: BabelConfigGeneratorOptions,
): { loader: string; options: BabelLoaderOptions } => ({
  loader: require.resolve('babel-loader'),
  options: {
    sourceMap: true,
    ...getBabelConfig(options),
    /**
     * Disable search for config files, we want this to be the single source of
     * truth for the webpack transpilation
     */
    configFile: false,
    cacheDirectory: true,
    cacheCompression: false,
  },
});

export const getCoreJsResolutionModuleRule = () => ({
  test: /\.(js|mjs|cjs)$/,
  use: [
    {
      ...getWebpackBabelLoaderConfig({
        coreJsResolutionFixOnly: true,
      }),
    },
  ],
});

export const getModuleRuleForSourceMapsInNodeModules = () => ({
  test: new RegExp(`\\.${SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS.join('|')}$`),
  enforce: 'pre' as const,
  use: [require.resolve('source-map-loader')],
});

/**
 * This rule prevents errors like:
 *
 *   Module not found: Error: Can't resolve '<some import to package>'
 *   The request '<some import to package>' failed to resolve only because it was resolved as fully specified
 *
 * for packages in `node_modules`.
 *
 * The error usually occurs when a package is an EcmaScript Module,
 * e.g. where the package.json contains `"type": "module"` but it hasn't
 * defined "exports" property.
 *
 * In such situation it's expected all imports from this module
 * to include the file extension. This is what fully specified means.
 *
 * In yotpo (but likely elsewhere as well) we have legacy packages that
 * don't follow this requirement and omit the file extensions, we need to
 * disable this expectation.
 *
 */
export const getModuleRuleForESModulePackagesWithNoExports = () => ({
  test: /\.(js|cjs|mjs)$/,
  include: /node_modules/,
  resolve: {
    fullySpecified: false,
  },
});
