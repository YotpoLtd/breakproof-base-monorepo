# `@repo/depcheck-base-isolated`

This package does 2 things:

1. provide detailed base configuration for `depcheck`
2. includes a tiny tsconfig which then uses to verify `.depcheckrc.ts` has no TS
   errors. It is exposed as the `depcheck:ts-check` script in `package.json`
3. lets other packages run `depcheck` checks using **_this_** package's specific
   `node.js` version. It works by providing a script called `depcheck` in its
   `package.json` that other packages can call instead of calling `depcheck`:
   ```shell
   # use:
   pnpm --filter='@repo/depcheck-base-isolated' run depcheck ....
   # instead of:
   depcheck ....
   ```

You can find [info about `depcheck`](../../../docs/tools-details.md) about the
role, config & alternatives of each tool.
