---
to: "<%- type !== PackageType.LIB ? null : `${h.getDestinationByType({ type, subtype, name })}/rollup.config.ts`%>"
---
import { NodeEnv, SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS } from '@repo/environment';
import {
  externalizeNonSource,
  getBabelPluginConfig,
  getDefaultOutputOptions,
  getTypescriptPluginConfig,
  RollupOptions
} from '@repo/rollup-base-isolated';
import { babel, commonjs, resolve, typescript } from '@repo/rollup-base-isolated/plugins';

const IS_PRODUCTION = process.env.ROLLUP_WATCH !== 'true';
const NODE_ENV = IS_PRODUCTION ? NodeEnv.PROD : NodeEnv.DEV;

const config: RollupOptions = {
  input: './src/index.<%- techStack === TechStack.REACT ? 'tsx': 'ts' %>',
  output: getDefaultOutputOptions(),
  external: externalizeNonSource,
  plugins: [
    resolve({ extensions: SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS.map(ext => `.${ext}`) }),
    commonjs(),
    babel(getBabelPluginConfig({
      mode: NODE_ENV,
      <% if (techStack === TechStack.REACT) { %>
        react: true,
        reactStyledComponents: true,
      <% } else { %>
        lit: true,
      <% } %>
    })),
    typescript(getTypescriptPluginConfig())
  ]
};

export default config;
