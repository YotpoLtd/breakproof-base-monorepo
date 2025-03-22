---
to: "<%- type !== PackageType.APP ? null : `${h.getDestinationByType({ type, subtype, name })}/webpack.config.ts`%>"
---
import * as path from "node:path";

import { Configuration } from "webpack";

<% if (type === PackageType.APP) {%>
  import HtmlWebpackPlugin from "html-webpack-plugin";
<% } %>

<% if (type === PackageType.LIB) {%>
  import packageJson from './package.json';
<% } %>

import {
  getCoreJsResolutionModuleRule,
  getWebpackBabelLoaderConfig,
  getModuleRuleForSourceMapsInNodeModules,
  getModuleRuleForESModulePackagesWithNoExports,
} from "@repo/webpack-base-isolated";

import {
  NodeEnv,
  SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS,
} from "@repo/environment";

export default (
  env: { production?: unknown },
  webpackArgs: { mode: "none" | "development" | "production" },
): Configuration => {
  const PRODUCTION = Boolean(
    env.production ||
    webpackArgs.mode === NodeEnv.PROD ||
    process.env.NODE_ENV === NodeEnv.PROD,
  );
  const mode = PRODUCTION ? NodeEnv.PROD : NodeEnv.DEV;
  const SRC_DIR = path.resolve(__dirname, "src");
  const IS_ANALYZING_BUNDLE = Boolean(process.env.ANALYZE_BUNDLE);
  
  return {
    mode,
    entry: {
      index: SRC_DIR,
    },
    output: {
      filename: '[name].js?[contenthash]'
    },
    ...(!PRODUCTION && {
      devtool: 'eval-source-map'
    }),
    <% if (type === PackageType.LIB) {%>
      output: {
        library: {
          /**
           * As long as this is NPM package (and not MFE) we should export as commonjs and ESM
           * `commonjs-static` makes it possible for exports to work for both CJS and ESM
           * ref: https://webpack.js.org/configuration/output/#type-commonjs-static
           */
          type: 'commonjs-static'
        }
      },
    <% } %>
    <% if (type === PackageType.LIB) {%>
      externals: [
        /**
         * Omit all peer dependencies from the build
         */
        ...Object.keys(packageJson.peerDependencies).map(moduleName => new RegExp(`${moduleName}(/.+)?`)),
      ],
    <% } %>
    optimization: {
      ...(IS_ANALYZING_BUNDLE && {
        concatenateModules: false
      })
    },
    resolve: {
      extensions: SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS.map((ext) => `.${ext}`),
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    },
    plugins: [
      <% if (type === PackageType.APP) {%>
        new HtmlWebpackPlugin({
          template: path.join(SRC_DIR, "index.html"),
        }),
      <% } %>
    ],
    module: {
      strictExportPresence: true,
      rules: [
        getModuleRuleForSourceMapsInNodeModules(),
        getModuleRuleForESModulePackagesWithNoExports(),
        {
          oneOf: [
            {
              test: new RegExp(
                `\\.${SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS.join("|")}$`,
              ),
              include: path.resolve(__dirname, "src"),
              use: [
                getWebpackBabelLoaderConfig({
                  mode,
                  <% if (techStack === TechStack.REACT) { %>
                    react: true,
                    reactStyledComponents: true,
                  <% } %>
                  // this will prevent core-js polyfill imports which will reduce the noise when analysing stats of the bundle
                  disableCoreJsPolyfills: IS_ANALYZING_BUNDLE
                }),
              ],
            },
            getCoreJsResolutionModuleRule(),
          ]
        },
      ],
    },
  };
};
