# `@repo/eslint-problem-snapshotter`

Utilizes `@repo/code-problem-snapshotter` to snapshot existing `eslint` problems
and only alert about the new ones.

## Simple usage example

```shell
# to snapshot existing problems:
eslint '<file glob>' --format json | yotpo-eslint-problem-snapshotter remember-existing-problems

# to check for new:
eslint '<file glob>' --format json | yotpo-eslint-problem-snapshotter check-new-problems
```

The `--format json` part is important as it changes the output to be `JSON`

## Integration

1. Make your `eslint` config file as strict as you like. Your dream strictness:
   add new rules, change existing, etc.
2. Modify your `.lintstagedrc.cjs`/`.lintstagedrc.mjs` and replace the `eslint`
   entry with a new one that includes this package. If you had:
   ```js
   '*.{js,cjs,mjs,ts,jsx,mts,tsx}': filenames =>
   	`eslint --no-eslintrc --config=.eslintrc-precommit.cjs ${filenames.map(file => `"${file}"`).join(' ')}`
   ```
   Replace it with:
   ```js
   '*.{js,cjs,mjs,ts,jsx,tsx}': filenames =>
   	`eslint --no-eslintrc --config=.eslintrc-precommit.cjs ${filenames.map(file => `"${file}"`).join(' ')} --format json | yotpo-eslint-problem-snapshotter check-new-problems`
   ```
3. Do initial run to capture all existing problems by executing:
   ```shell
   npx eslint --no-eslintrc  --config=<YOUR MAIN CONFIG HERE> '*.{js,cjs,mjs,ts,mts,jsx,tsx}' --format json  | npx yotpo-eslint-problem-snapshotter remember-existing-problems
   ```
