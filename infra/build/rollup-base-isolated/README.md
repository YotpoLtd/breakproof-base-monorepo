# `@repo/rollup-base-isolated`

This package does 4 things:

1. install `rollup` and a selection of its plugins,
   [only to act as their isolated node.js environment (_as described in the docs_)](../../../docs/monorepo.md#but-how-multiple-nodejs)
   and then expose them as `package.json` scripts.
2. provide defailed base configuration for `rollup` (_tailored for building
   libraries_) and optional helpers to get that base config
3. include `rollup` plugins used as part of the base config
4. re-export rollup types so that you can refer to them in your project configs

You can find
[info about `rollup` in the documentation](../../../docs/tools-details.md#rollup-config)
about the role, config & alternatives of each tool.
