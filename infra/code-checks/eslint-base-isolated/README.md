# `@repo/eslint-base-isolated`

This package does 4 things:

1. provide detailed base configurations for `eslint`, and `prettier`.
   1. with separate `eslint` base configurations for separate use-cases.
1. expose a `package.json:validate` script that uses `eslint` to validate the
   shape of `package.json` files. It is used during CI & git hooks to ensure
   that we check this even if developers have disabled this config in their
   project-specific eslint config
1. lets other packages run `eslint` checks using **_this_** package's specific
   `node.js` version. It works by providing a script called `eslint` in its
   `package.json` that other packages can call instead of calling `eslint`:

All local scripts are then re-exposed as `shared:*` scripts at the
[repo-root `package.json5` with inline documentation.](../../../package.json5).

You can find
[info about `eslint` in the documentation](../../../docs/tools-details.md) about
the role, config & alternatives of each tool.
