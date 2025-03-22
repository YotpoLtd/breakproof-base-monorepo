# `@repo/lint-staged-base-isolated`

This package does 3 things:

1. provide detailed base configuration for `lint-staged`
   1. **standard usage**: simply extend it in the lint-staged config of your
      package
   2. **extras**:
      1. the base file also exports some useful variables:
         1. `ESLINT_PATTERN` – if you want to override the `eslint` command
            without duplicating the pattern
         2. `PRETTIER_PATTERN` – if you want to override the `prettier` command
            without duplicating the pattern
         3. `TSC_PATTERNS_PER_TSCONFIG` – if you want to override the `tsc`
            command without duplicating the patterns
         4. `TSC_CONFIG_FILENAMES` – if you want to add other commands for
            `TypeScript` files
         5. `TSC_COMMANDS_PER_TSCONFIG` – the actual `tsc` command that will be
            executed for each `tsconfig`
      2. you can use 2 environment variables to quickly switch behaviour of the
         code checks instead of reconfiguring them:
         1. `LINT_SHOULD_FIX` – when non-empty, use same configuration but
            instead of just reporting problems, try fixing them. Only the
            commands that can autofix are run.
         2. `ESLINT_ACTIVE_CONFIG` – when non-empty, switch eslint config file
            without overriding the entire command. The value can be a relative
            path to your package or absolute one.
2. lets other packages run `lint-staged` checks using **_this_** package's
   specific `node.js` version. It works by providing a scripts called
   `staged:lint` and `staged:fix:lint` in its `package.json` that other packages
   can call instead of calling `lint-staged`:
3. re-export `lint-staged` types so that you can refer to them in your project
   configs

You can find [info about `lint-staged`](../../../docs/tools-details.md) about
the role, config & alternatives of each tool.
