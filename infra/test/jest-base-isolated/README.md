# `@repo/jest-base-isolated`

This package has 3 goals:

1. provide detailed base configurations for `jest` and re-exports `jest` types.
2. **installs `jest` and lets other packages run `jest` tests using **_this_\*\*
   package's specific `node.js` version. It works by providing a script called
   `jest` in its `package.json` that other packages can call instead of calling
   `jest`:
   [act as its isolated node.js environment (_as described in the docs_)](../../../docs/monorepo.md#but-how-multiple-nodejs)

   ```shell
   # use:
   pnpm --filter='@repo/jest-base-isolated' run jest ....
   # instead of:
   jest ....
   ```

You can find
[info about `jest` in the documentation](../../../docs/tools-details.md#jest-config)
about the role, config & alternatives of each tool.

## Extras

- packages doesn't need to provide `jest` config file, the `jest.config.mjs`
  from this package is used
- packages can provide `jest` setup file by creating a `jest.setup.ts` but they
  can also skip it, which will default to the `jest.setup.ts` in this package

## Caveats

It uses `babel-jest` from `"@repo/babel-base-isolated` because all other `babel`
dependencies live there.
