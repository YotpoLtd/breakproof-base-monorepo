# `@repo/generators`

This package does 2 jobs:

- **installs `hygen`** and
  [act as its isolated node.js environment (_as described in the docs_)](../../../docs/monorepo.md#but-how-multiple-nodejs)
- contains all templates / code generators for this repository

You can find
[info about `hygen` in the documentation](../../../docs/tools-details.md#hygen-role)
about the role, config & alternatives of each tool.

## General info

- All templates (`*.ejs.t`) have access to variables exported from
  `extra-template-vars.ts`.
- All command line prompt questions for the generators are defined in
  `prompts.ts` which has access to the same additional variables by importing
  `#extra-template-vars`.
- You can call one generator from another generator by:
  1. Defining a `sh` key in the header section of the template like so:
     ```
     ---
     sh: |
       ...any bash command here...
     ---
     ...whatever template contents here...
     ```
  2. Adding generator command in `...any bash command here...` section and pass
     all required inputs as CLI arguments (_arguments are parsed by_ `yargs`):
     ```
     ---
     sh: |
       pnpm -w generate <generator-name> <generator-action> --name="<%= youLikelyKnowThis %> --inputName="value" --anotherInput="value"
       # when you have array
       pnpm -w generate <generator-name> <generator-action> --arrayInput=item1 --arrayInput=item2
       # when you have boolean
       pnpm -w generate <generator-name> <generator-action> --boooleanInputFalse=0 --anotherBooleanInputTrue
     ---
     ...whatever template contents here...
     ```
