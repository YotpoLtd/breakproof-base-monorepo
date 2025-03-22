`@repo/lit-analyzer-wrapper`

Provides `CLI` tools around the `lit-analyzer` packages that:

1. allow integration with projects that use `typescript` lower than v5
2. allow alerting only for new problems

## The 2 CLI tools: `yotpo-lit-analyzer-legacy` & `yotpo-lit-analyzer-snapshotter`

### `yotpo-lit-analyzer-legacy` CLI tool

This is intended for use only for packages that are not using `typescript` v5

`lit-analyzer` works best with `typescript` v5, not lower. In a `pnpm` repo we
can wrap `lit-analyzer` in a workspace package that also has `typescript` v5 as
dependency

However, in `npm`-based repos we can't do that since we have a single
`package.json` and we can't have multiple packages each with different
dependencies.

So we need a different approach:

1. have this package with a dependency of `typescript` v5.
2. in the package include a binary like `lit-analyzer` but called
   `yotpo-lit-analyzer-legacy` which internally simply imports `lit-analyzer`.
3. before that import we want to monkey-patch the `require()` calls itself and
   redirect `require('typescript')` to our local TS5 dependency
4. publish to npm registry
5. use `yotpo-lit-analyzer-legacy` instead of `lit-analyzer`

### `yotpo-lit-analyzer-snapshotter` CLI tool

This enables the linting of your project to only report new errors. It does that
by allowing you to create a snapshot of "already known problems" that you can't
fix at the moment, and you want to be alerted only for anything new on top of
them.

## Integration with the `@yotpo-common/shared-linter-config` config

1. in your package install `ts-lit-plugin` and `@repo/lit-analyzer-wrapper`.
2. in the lib or app that uses `lit`, open `tsconfig.json` and add the following
   under `compilerOptions`:

   ```json
   "plugins": [
     {
       "name": "ts-lit-plugin",
       "strict": true,
       "rules": {
         "no-missing-import": "error"
       }
     }
   ]
   ```

3. Snapshot "already known problems" by going into the directory of package that
   uses `lit` and run:

   ```sh
   pnpm exec yotpo-lit-analyzer --format markdown | pnpm exec yotpo-lit-analyzer-snapshotter remember-existing-problems
   # or
   pnpm exec yotpo-lit-analyzer-legacy --format markdown | pnpm exec yotpo-lit-analyzer-snapshotter remember-existing-problems
   ```

4. Add the generated `.lit-problems-snapshot.json` to your upcoming git commit.

5. In the package that uses `lit`, open `.lintstagedrc.mjs` add the following :

   ```json5
     "*.ts": ["yotpo-lit-analyzer --format markdown | yotpo-lit-analyzer-snapshotter check-new-problems"]
     // or
     "*.ts": ["yotpo-lit-analyzer-legacy --format markdown | yotpo-lit-analyzer-snapshotter check-new-problems"]
   ```

6. Commit all changes

When you improve the `lit` problems in your codebase you can again run:

```shell
pnpm exec yotpo-lit-analyzer --format markdown | pnpm exec yotpo-lit-analyzer-snapshotter remember-existing-problems`
# or
pnpm exec yotpo-lit-analyzer-legacy --format markdown | pnpm exec yotpo-lit-analyzer-snapshotter remember-existing-problems`
```

to recreate the snapshot.

## Code editor integration

To integrate your editor its intellisense needs to use `typescript` v5 for the
error reporting.

**NOTE: Changing this WILL NOT change the typescript version used to build your
project!**.

- in `Jetbrains` products go to `Settings | Languages & Frameworks | TypeScript`
  and point to the typescript version of this package:
  `node_modules/@repo/lit-analyzer-wrapper/node_modules/typescript`
- in `vscode` change the `Tsdk` setting to point to the typescript version of
  this package:
  `node_modules/@repo/lit-analyzer-wrapper/node_modules/typescript/lib`
