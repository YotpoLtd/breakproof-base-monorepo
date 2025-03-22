# `@repo/tsc-problem-snapshotter`

Utilizes `@repo/code-problem-snapshotter` to snapshot existing TypeScript
problems and only alert about the new ones.

## Simple usage example

```shell
# to snapshot existing problems:
pnpm exec tsc --project tsconfig.build.json --noEmit --pretty false | pnpm exec yotpo-tsc-problem-snapshotter remember-existing-problems

# to check for new:
pnpm exec tsc --project tsconfig.build.json --noEmit --pretty false | pnpm exec yotpo-tsc-problem-snapshotter check-new-problems
```

The `--pretty false` part is important as it changes the output to include less
spacing and no colors, which makes more parseable.

## Integration

1. Duplicate the `tsconfig` file that you use to run your build.
2. Make the new config as strict as possible. You can use `@tsconfig/strictest`
   package by adding `"extends": "@tsconfig/strictest/tsconfig"` in your new
   config. If extending doesn't work for you, just copy-paste settings from
   there.
3. Modify your `.lintstagedrc.mjs` and add a new entry specific to the
   TypeScript files in your project. This entry should execute `tsc` for
   type-checking only (not creating files) and together with it execute
   `yotpo-tsc-problem-snapshotter`. E.g.:
   ```js
   '**/*.{ts,mts,cts,tsx}': () => ['tsc --project <your new strict tsconfig name> --noEmit --pretty false | yotpo-tsc-problem-snapshotter check-new-problems']
   ```
4. Do initial run to capture all existing problems by executing:
   ```shell
   pnpm exec --project <your new strict tsconfig name>  --noEmit --pretty false | npx yotpo-tsc-problem-snapshotter remember-existing-problems
   ```
