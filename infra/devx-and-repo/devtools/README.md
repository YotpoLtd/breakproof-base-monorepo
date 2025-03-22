# `devtools`

This package is a helper package for local development, does 4 jobs.

Two of them are very generic:

1. acts as installation shortcut for repository dependencies you need during
   local development. It simply defines them as dependencies, so installing
   `devtools` also installs them
2. makes sure some of those dependencies are build by running their `build`
   script as a `postinstall` step

And the other two are specific to webpack-powered apps:

1. install `webpack-bundle-analyzer` (_useful for analyzing problems_)
   [only to act as its isolated node.js environment (_as described in the docs_)](../../../docs/monorepo.md#but-how-multiple-nodejs)
   and then expose them as `package.json` scripts.
2. includes a tiny script that cleans up `webpack` stats by removing any info
   about third-party dependencies from it. Useful when analyzing bundle graph
   via https://webpack.github.io/analyse/

All local scripts are then re-exposed as `shared:*` scripts at the
[repo-root `package.json5` with inline documentation.](../../../package.json5)

You can find
[info about `webpack` in the documentation](../../../docs/tools-details.md#webpack-role)
about the role, config & alternatives of each tool.
