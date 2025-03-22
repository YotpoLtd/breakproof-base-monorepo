import path from 'node:path';

import {
  NodePath as BabelNodePath,
  PluginItem as BabelPlugin,
  TransformOptions as BabelOptions,
} from '@babel/core';

import { NodeEnv, RuntimeEnv, SUPPORTED_WEB_BROWSERS } from '@repo/environment';

type BabelConfigGeneratorCoreJsResolutionFixOnly = {
  coreJsResolutionFixOnly: true;
};

export type BabelConfigGeneratorOptions =
  | BabelConfigGeneratorCoreJsResolutionFixOnly
  | {
      mode: NodeEnv;
      /**
       * Are you going to use Lit?
       */
      lit?: boolean;
      /**
       * Are you going to use React?
       */
      react?: boolean;
      /**
       * Are you going to use styled-components?
       */
      reactStyledComponents?: boolean;
      /**
       * Stops automatic import of core-js polyfills. Useful when analyzing the
       * bundle
       */
      disableCoreJsPolyfills?: boolean;
      /**
       * Set to false to disable resolving `core-js` to
       * babel-base-isolated/node_modules
       */
      coreJsResolutionFix?: boolean;
      /**
       * What runtime environment you want to transpile for?
       */
      runtimeTarget?: RuntimeEnv;
    };

export type SupportedBabelOptions = Omit<BabelOptions, 'include' | 'exclude'>;

const isCoreJsResolutionFixOnly = (
  options: BabelConfigGeneratorOptions,
): options is BabelConfigGeneratorCoreJsResolutionFixOnly =>
  'coreJsResolutionFixOnly' in options && options.coreJsResolutionFixOnly;

/**
 * Get sensible babel config based on a minimal set of input
 */
export const getBabelConfig = (
  options: BabelConfigGeneratorOptions,
): SupportedBabelOptions => ({
  babelrc: false,
  sourceType: 'unambiguous', // allow files with module.exports =

  ...(isCoreJsResolutionFixOnly(options)
    ? {
        presets: [
          {
            plugins: [resolveCoreJsToCurrentDirPlugin],
          },
        ],
      }
    : {
        presets: (
          [
            /**
             * @see see the jsdoc of resolveCoreJsToCurrentDir
             */
            options.coreJsResolutionFix !== false && {
              plugins: [resolveCoreJsToCurrentDirPlugin],
            },
            [
              require.resolve('@babel/preset-env'),
              {
                useBuiltIns: options.disableCoreJsPolyfills ? false : 'usage',
                targets:
                  options.runtimeTarget === RuntimeEnv.NODE
                    ? { node: true }
                    : { browsers: SUPPORTED_WEB_BROWSERS },
                /**
                 * If we don't explicitly set corejs version, babel defaults to
                 * older nested dependency version
                 */
                // eslint-disable-next-line @typescript-eslint/no-var-requires -- We need require() so that this is inlined
                corejs: (require('core-js/package.json') as { version: string })
                  .version,
              },
            ],

            Boolean(options.react) && [
              require.resolve('@babel/preset-react'),
              {
                /**
                 * Tells Babel to automatically inject the necessary React
                 * import statements inside the code
                 */
                runtime: 'automatic',
                development: Boolean(options.mode === NodeEnv.DEV),
              },
            ],
          ] satisfies Array<BabelPlugin | false>
        ).filter(Boolean) as Array<BabelPlugin>,

        plugins: (
          [
            /**
             * Automatically assigns a display name to anonymous React
             * components which helps with debugging and error messages.
             */
            Boolean(options.mode === NodeEnv.DEV && options.react) &&
              require.resolve('babel-plugin-react-anonymous-display-name'),

            Boolean(options.reactStyledComponents) && [
              require.resolve('babel-plugin-styled-components'),
              {
                displayName: true,
                fileName: true,
              },
            ],
          ] satisfies Array<BabelPlugin | false>
        ).filter(Boolean) as Array<BabelPlugin>,

        overrides: [
          {
            test: /\.tsx$/,
            plugins: [
              [
                require.resolve('@babel/plugin-transform-typescript'),
                { isTSX: Boolean(options.react) },
              ],
            ],
          },
          /**
           * TEMPORARILY NEEDED UNTIL WE REMOVE ANGULAR-specific DEPENDENCIES
           */
          {
            test: /\.ts$/,
            plugins: [
              [
                require.resolve('@babel/plugin-proposal-decorators'),
                {
                  ...(options.lit
                    ? {
                        version: '2018-09',
                        decoratorsBeforeExport: true,
                      }
                    : { version: 'legacy' }),
                },
              ],
              // ["@babel/plugin-proposal-class-properties", { loose: true }],
              require.resolve('babel-plugin-parameter-decorator'),
              require.resolve('@babel/plugin-transform-typescript'),
            ],
          },
        ],
      }),
});

/**
 * 1. We want to resolve `core-js` to the node_modules in _this_ package, so that
 *    we don't require `core-js` installs in other packages
 * 2. The usual solution would be alias via `babel-plugin-module-resolver` but it
 *    has a bug when using together with `@babel/preset-env`
 *
 * @see https://github.com/babel/babel/issues/10379
 * @see https://github.com/babel/babel/issues/10142
 */
type BabelNodeSourceAbstract = { value: string };
const PATH_TO_CORE_JS_IN_THIS_PACKAGE = path.dirname(
  require.resolve('core-js'),
);
const resolveCoreJsToCurrentDir = <
  TBabelNodeSource extends BabelNodeSourceAbstract,
>(
  source: TBabelNodeSource,
) => {
  if (source.value.startsWith('core-js')) {
    source.value = source.value.replace(
      /^core-js/,
      PATH_TO_CORE_JS_IN_THIS_PACKAGE,
    );
  }
};

export const resolveCoreJsToCurrentDirPlugin = (): BabelPlugin => ({
  /**
   * Implemented as per:
   *
   * @see https://github.com/babel/babel/issues/10379#issuecomment-527077992
   */
  post({ path }) {
    path.traverse({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- babel AST requires this naming
      ImportDeclaration(path) {
        resolveCoreJsToCurrentDir(path.node.source);
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention -- babel AST requires this naming
      CallExpression(path) {
        if (
          path.get('callee').isIdentifier({ name: 'require' }) &&
          path.node.arguments.length === 1 &&
          (path.get('arguments.0') as BabelNodePath).isStringLiteral()
        ) {
          resolveCoreJsToCurrentDir(
            path.node.arguments[0] as BabelNodeSourceAbstract,
          );
        }
      },
    });
  },
});
