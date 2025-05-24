## `breakproof-base-repo`

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list) –
[⬅️️ Back to main nav 📌](../README.md#breakproof-nav)

## 🗃️ Tool details

### `pnpm`

<a name="pnpm-role"></a>

#### Role of `pnpm` in the repo

- to manage nodejs versions
- to install dependencies for each package as individual isolated `node_modules`
- to get even stricter dependency installation, one with no hoisting or
  undeclared peer dependencies
- to enable tools & projects to upgrade their and only their `node.js` version,
  a.k.a. allowing different `node.js` version to be used by each individual
  package (_that don't need to share runtime_)
- to enable any package to run a script from another package in the repo thus
  achieving cross-node tooling
- to run `npm` scripts or execute commands for a specific subset of packages
  based on a _"filter"/"selector"_
- to have a list of common npm scripts in a single place that can be used by all
  packages
- to apply install-time patches to third-party `npm` packages that have bugs,
  problems in their dependencies' definition or lacking easy-to-add features
- to rely that if 2 packages has the same dependency with the same version, then
  `node_modules` files of that dependency in both packages are actually symlinks
  to the same files, so it's all resolved to the same file paths
- to be able to identify which package a certain CLI log line comes from even
  when running parallel `npm` scripts from different packages
- to list repository package names & their directories

<a name="pnpm-config"></a>

#### Applied `pnpm` configuration

Since the `pnpm` is a repo-level tool and not project-level, you can modify
those setting only by editing the original files, not by extending them. That's
why we call this `forkable` instead of `base` config.

- [`<repo root>/.npmrc`](../.npmrc)
  - apply strict & isolated dependency installations
  - enable automatic `pnpm` version management
  - guarantee that `bash` is used to execute all `npm` scripts, so we don't deal
    with multiple shell variations
  - pick default `node.js` version for the repo used for installations,
    repo-root files and your code editor
- [`<repo root>/package.json5`](../package.json5)
  - apply fixes
- [`<repo root>/.pnpmfile.cjs`](../.pnpmfile.cjs)

  - apply more advanced fixes to third-party `npm` package dependencies'
    definitions
  - enable installing a few dependencies at `<repo root>/node_modules` ONLY on
    developer workstations, not on CI. The dependencies are declared under the
    `codeEditorIntegrationDependencies` property of
    [`<repo root>/package.json5`](../package.json5). They are intended purely
    for code-editor integration.

#### Possible alternatives of `pnpm`

_[see 📋 "What's next?"](../README.md#whats-next)_

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `bash`

<a name="bash-role"></a>

#### Role of `bash` in the repo

Shell commands & scripts are the default "_language of the terminal_", so we use
it for:

- to shortcut common `pnpm` commands as bash functions, which are used in git
  hooks & CI
- to shortcut shell commands, which are used to check that convention are kept

#### Possible alternatives of `bash`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `shell-check`

<a name="shell-check-role"></a>

#### Role of `shell-check` in the repo

- to alert for problems in bash code
- to alert for problems in GitHub workflow shell steps

#### Possible alternatives of `shell-check`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `eslint` + plugins

<a name="eslint-role"></a>

#### Role of `eslint` + plugins in the repo

- to highlight problematic code in code editors relying on well-established
  existing (`eslint`) integration
- to run code checks for the same problems in case developers have missed
  something
- to verify that files that need to be in `.json` format match conventions and
  highlight it in the code editor if they don't
- to have project-specific configuration for what code checks get executed
- to make sure code editors understand and follow the project-specific
  configuration

<a name="eslint-config"></a>

#### Available `eslint` + plugins base configuration

- [`<repo root>/infra/code-checks/eslint-base-isolated/src/eslint*`](../infra/code-checks/eslint-base-isolated/src):
  - codify conventions for `package.json` shape
- [ `<repo root>/infra/code-checks/yotpo-shared-linter-config/src/*`](../infra/code-checks/yotpo-shared-linter-config/src)
  - the main set of base configurations & their rules we use internally in yotpo
  - config files specific to runtime (_`browser` vs `node`_) & framework
    (_`react`, etc._)
  - extending `eslint:recommended`, `eslint-comments/recommended`,
    `@typescript-eslint/recommended` and
    `@typescript-eslint/recommended-requiring-type-checking`
  - codify conventions via different plugins & rules
  - ignore known generated files & tweak for known edge cases
  - based on the `eslint` flat config

#### Possible alternatives of `eslint`

_[see 📋 "What's next?"](../README.md#whats-next)_ \*(eslint 8 to be upgraded to
eslint 9)

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `prettier`

<a name="prettier-role"></a>

#### Role of `prettier` in the repo

- to surrender opinion about formatting of different file formats to a tool,
  saving development time
- to enforce line width to various file types for better readability
- to integrate well with other tools for code checking (_e.g. `eslint`_)

<a name="prettier-config"></a>

#### Available `prettier` base configuration

- [ `<repo root>/infra/code-checks/eslint-base-isolated/src/prettierrc-base.ts`](../infra/code-checks/eslint-base-isolated/src/prettierrc-base.ts)

#### Possible alternatives of `prettier`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

<a name="typescript-role"></a>

### `typescript`

#### Role of `typescript` in the repo

- to make onboarding and code reuse easier with its type suggestions
- to have better customer experience by preventing bugs with its type checking
- to make configuring tools easier, since
  [it's a convention to use `.ts` config files whenever possible](../README.md#conventions-and-core-principles)
  which would again provide type suggestions

<a name="typescript-config"></a>

#### Available `typescript` base configuration

There are multiple base configs available for different use cases, for example:
building a nodejs library, browser library, frontend application, etc. Each of
those requires slightly different settings:

- [`<repo root>/infra/build/typescript-base-isolated/tsconfig\*.json`](../infra/build/typescript-base-isolated)

#### Possible alternatives of `typescript`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `actionlint`

<a name="actionlint-role"></a>

#### Role of `actionlint` in the repo

- to alert for problems in your GitHub workflows

#### `actionlint` tweaks in the repo

- automatically downloaded
- we download `shell-check` as well since it uses it internally to verify
  workflow shell scripts

#### Possible alternatives of `actionlint`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `lint-staged`

<a name="lint-staged-role"></a>

#### Role of `lint-staged` in the repo

- to use an industry-recognized config format for mapping between file pattern
  in your project and what code checks to run for them
- to fail fast and output only relevant info
- to run code-checks only against the files changed in a pull request
- to run code-checks only against the files staged to be committed
- to run the all applicable checks but in "autofix" mode, either for all project
  files or only to the subset of changed files (in a PR or staged to be
  committed)

<a name="lint-staged-config"></a>

#### Available `lint-staged` base configuration

- [ `<repo root>/infra/code-checks/lint-staged-base-isolated/src/lintstagedrc-base.mts`](../infra/code-checks/lint-staged-base-isolated/src/lintstagedrc-base.mts)
  – orchestrates all other code check tools to run over files that they
  understand
  - additionally to the `default` export of the base config, there are some
    extra named export in there that can be useful when overriding
  - don't run `tsc` check the changed files are not included in corresponding
    `tsconfig` file
- there is
  [a `node.js` script](../infra/code-checks/lint/run-lint-staged-config-but-for-all-package-files.mjs)
  that can understand `lint-staged` config format but will run against all
  project files (_something `lint-staged` cannot do by itself_)

#### Possible alternatives of `lint-staged`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `dpdm`

<a name="dpdm-role"></a>

#### Role of `dpdm` in the repo

- to detect circular imports/dependencies inside your project which can
  otherwise cause a hard-to-debug build-time problems

#### Possible alternatives of `dpdm`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `depcheck`

<a name="depcheck-role"></a>

#### Role of `depcheck` in the repo

- to prevent install of unused dependencies
- to prevent usage of undeclared dependencies

<a name="depcheck-config"></a>

#### Available `depcheck` base configuration

- [ `<repo root>/infra/code-checks/eslint-base-isolated/src/depcheckrc-base.ts`](../infra/code-checks/eslint-base-isolated/src/depcheckrc-base.ts)
  - add known false-positives

#### Possible alternatives of `depcheck`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `syncpack`

<a name="syncpack-role"></a>

#### Role of `syncpack` in the repo

- to enforce specific range or exact version of a dependency across different
  projects
- to act as a code check for dependencies that are declared "unsupported" or
  "deprecated"
- to sync version of projects that need to always be released with the same
  version

<a name="syncpack-config"></a>

#### Applied `syncpack` configuration

- [`<repo root>/.syncpackrc.js`](../.syncpackrc.js)

#### Possible alternatives of `syncpack`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `cypress`

<a name="cypress-role"></a>

#### Role of `cypress` in the repo

- to run e2e or integration tests of your frontend project in a real browser
- to have tools for easy analysis of failing or flaky tests

<a name="cypress-config"></a>

#### Available `cypress` base configuration

- [ `<repo root>/infra/test/cypress-base-isolated/src/cypress.config.base.ts`](../infra/test/cypress-base-isolated/src/cypress.config.base.ts)
- [ `<repo root>/infra/test/cypress-base-isolated/src/cypress.e2e.setup.base.ts`](../infra/test/cypress-base-isolated/src/cypress.e2e.setup.base.ts)

<a name="cypress-sass"></a>

#### Optional SaSS services working with `cypress`

- visual testing in cypress using Argos CI SaSS

#### Possible alternatives of `cypress`

_[see 📋 "What's next?"](../README.md#whats-next)_ \*(playwright is under
consideration as replacement)

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `jest`

<a name="jest-role"></a>

#### Role of `jest` in the repo

- to execute/develop unit tests

#### Specifics of `jest`

- the `@repo/jest-base-isolated` package isolates all jest dependencies into a
  package that run with specific version of `node.js` that `jest` supports
- packages that need to run/develop unit tests should execute via
  `pnpm --filter="@repo/jest-base-isolated" run jest` instead of
  `pnpm exec jest` or `jest`. Any arguments passed to the `jest` script inside
  `"@repo/jest-base-isolated"` are passthrough and reach `jest` itself

<a name="jest-config"></a>

#### Available `jest` base configuration

- [ `<repo root>/infra/test/jest-base-isolated/src/jest.config.base.ts`](../infra/test/jest-base-isolated/src/jest.config.base.ts)
  - uses `babel` to transpile `.ts` files
  - enables jsdom as test environment
- [ `<repo root>/infra/test/jest-base-isolated/src/jest.config.base.react.ts`](../infra/test/jest-base-isolated/src/jest.config.base.react.ts)
- [ `<repo root>/infra/test/jest-base-isolated/src/jest.setup.base.ts`](../infra/test/jest-base-isolated/src/jest.setup.base.ts)
- [ `<repo root>/infra/test/jest-base-isolated/src/jest.resolver.ts`](../infra/test/jest-base-isolated/src/jest.resolver.ts)
  - tweaks on its module resolution
- [ `<repo root>/infra/test/jest-base-isolated/src/jest.types.ts`](../infra/test/jest-base-isolated/src/jest.types.ts)
  - re-export of `jest` types
- [ `<repo root>/infra/test/jest-base-isolated/jest.setup.ts`](../infra/test/jest-base-isolated/jest.setup.ts)
- [ `<repo root>/infra/test/jest-base-isolated/jest.config.mjs`](../infra/test/jest-base-isolated/jest.config.mjs)

#### Possible alternatives of `jest`

_[see 📋 "What's next?"](../README.md#whats-next)_ \*(vitest is under
consideration as replacement)

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `conventional-changelog`

<a name="conventional-changelog-role"></a>

#### Role of `conventional-changelog` in the repo

- to determine the exact new semver based on git commit messages
- to determine if there are new versions to be released after a pull request is
  merged
- to account for changes in dependencies of your project that come directly from
  the repo and not from `npm`
- to automatically produce a changelog of the changes in a pull request

<a name="conventional-changelog-config"></a>

#### Available `conventional-changelog` base configuration

- [`<repo root>/infra/release/conventional-changelog-preset/src/*`](../infra/release/conventional-changelog-preset/src)
- [ `<repo root>/infra/release/release-shared-config/conventional-changelog-preset.pnpm.mjs`](../infra/release/release-shared-config/conventional-changelog-preset.pnpm.mjs)

#### Possible alternatives of `conventional-changelog`

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `release-it`

<a name="release-it-role"></a>

#### Role of `release-it` in the repo

- to collect relevant git commits to by analyzed for determining new version &
  changelog
- to be able to configure what git commits should be ignored
- to determine if release is needed for a package using a custom
  `conventional-changelog` preset
- to get the expected new version of a package (_if any_) using a CLI
- to publish to `npm` registry
- to create a `git` tag
- to create a `github` release
- to write a changelog file using `conventional-changelog`

<a name="release-it-config"></a>

#### Available `release-it` base configuration

- [ `<repo root>/infra/release/release-shared-config/release-it.base.ts`](../infra/release/release-shared-config/release-it.base.ts)
  - uses `conventional-changelog` for versioning
  - publishes to `npm`
  - creates `GitHub` release & tag
  - applies tweaks to make `release-it` work monorepos like this one
- [ `<repo root>/infra/release/release-shared-config/release.types.ts`](../infra/release/release-shared-config/release.types.ts)
  - extend all `release-it` types and re-exports them

#### Possible alternatives of `release-it`

_[see 📋 "What's next?"](../README.md#whats-next)_

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `webpack`

<a name="webpack-role"></a>

#### Role of `webpack` in the repo

- to accommodate building `angular` projects (_before alternative builds tools
  were possible_) and allow `react` projects that integrate in the angular build
- to enable micro-frontends that can share dependencies by defining acceptable
  version range (_using Module Federation_)
- to build `npm` packages that can grow into micro-frontends
- to enable the dependency-graph visualization of webpack:
  https://webpack.github.io/analyse/
- to enable size-based dependency visualization

<a name="webpack-config"></a>

#### Available `webpack` base configuration

- [`<repo root>/infra/build/webpack-base-isolated/src/webpack.config.generator.ts`](../webpack.config.generator.ts)
  - currently only exports a helper to get `babel-loader` configuration
- [ `<repo root>/infra/devx-and-repo/generators/\_templates/package/new/1_webpack.config.ts.ejs.t`](../infra/devx-and-repo/generators/_templates/package/new/1_webpack.config.ts.ejs.t)
  - allow importing certain file types without specifying file extension
  - specify output for libraries built using webpack
  - marks external dependencies for library projects
  - disables module concatanation when analyzing bundle
  - makes `React` available in all files
  - creates `html` file on-the-fly for apps
  - configures `babel` & its plugins to process `ts` and `tsx` files existing
    helpers

#### Possible alternatives of `webpack`

_[see 📋 "What's next?"](../README.md#whats-next)_ \*(import maps as replacement
in the long-term)

#### Planned additional features using `webpack`

_[see 📋 "What's next?"](../README.md#whats-next)_

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `sucrase`, `ts-node` & `tsx`

<a name="sucrase-tsnode-tsx-role"></a>

#### Role of `sucrase`, `ts-node` & `tsx` in the repo

- to allow `.ts` configuration for tools

**Yes, all 3 do the same thing**, however different tools only work well with
one or the other.

For example:

- `ts-node` is what `jest` uses
- `sucrase` is something that `webpack` works best with
- `tsx` can help on occasions where `ts-node` simply doesn't work, since
  `ts-node` has problems keeping up with `typescript` development, e.g.
  `ts-node` doesn't understand `tsconfig` files that extend multiple other
  `tsconfig` files)

<a name="sucrase-tsnode-tsx-config"></a>

#### Available `sucrase`, `ts-node` & `tsx` base configuration

- `sucrase` & `tsx` don't require configuration
- for tools that require `ts-node` we have:
  - the `ts-node` section in
    [`<repo root>/infra/build/typescript-base-isolated/tsconfig.base.json`](../infra/build/typescript-base-isolated/tsconfig.base.json):
    - enables `transpilation-only` mode since we use `tsc` for type checking
    - enables `sucrase` as transpiler

#### Possible alternatives of `sucrase`, `ts-node` & `tsx`

_[see 📋 "What's next?"](../README.md#whats-next)_

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `babel` + plugins

<a name="babel-role"></a>

#### Role of `babel` + plugins in the repo

- to transpile our source files to syntax supported by our targeted browsers
  simply by listing the required browsers using `browserlist` query
- it's possible to transpile source files using another tool and then use
  `babel` to do a second transpilation of the final bundle, but currently this
  repo chose not to have 2 transpilation steps and instead use `babel` as main
  tool to transpile source files. This means we rely on babel:
  - to transform `JSX` to `JavaScript`
  - to transform `TypeScript` to `JavaScript`
  - to transform proposed `TypeScript` like decorators to `JavaScript`
  - to transform `React Styled Components` to `JavaScript` & `CSS`

<a name="babel-config"></a>

#### Available `babel` base configuration

- [ `<repo root>/infra/build/webpack-base-isolated/src/babel.config.generator.ts`](../infra/build/webpack-base-isolated/src/babel.config.generator.ts):
  - helpers to get the base babel config
  - tiny plugin that allows appications to skip the install of `core-js` (_the
    industry standard polyfill lib_) by always resolving `core-js` to the
    already installed version in the package holding the shared config

#### Possible alternatives of `babel` + plugins in the repo

_[see 📋 "What's next?"](../README.md#whats-next)_

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `rollup` + plugins

<a name="rollup-role"></a>

#### Role of `rollup` + plugins in the repo

- to build the projects of type `library`, by combining other tools like `babel`
  to achieve that
- to use a better suited tool for building libraries than webpack
- to use a tool with simpler config and simpler plugin development requirements

<a name="rollup-config"></a>

#### Available `rollup` base configuration

- [ `<repo root>/infra/build/rollup-base-isolated/src/*`](../infra/build/rollup-base-isolated/src):
  - helpers so that your project config files can build their own rollup config
  - re-export of commonly used rollup plugins
  - re-export of rollup config TypeScript type
  - tiny plugin active only in `watch` mode, that will delete the created
    `dist/*` files if there is a TypeScript error. Useful if you want to
    explicitly fail the build of another project that uses this one during
    development

#### Possible alternatives of `rollup` + plugins in the repo

_[see 📋 "What's next?"](../README.md#whats-next)_

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `lit-analyzer`

<a name="lit-analyzer-role"></a>

#### Role of `lit-analyzer` in the repo

- to detect problems in the source files of projects that use web components
  with the `lit` library
- to integrate with code editors and show the code problems during files editing

<a name="lit-analyzer-config"></a>

#### Available `lit-analyzer` base configuration

Currently none but we want to integrate it inside our `lint-staged` base
configuration for projects that have `lit` installed.

#### Possible alternatives of `lit-analyzer

Nothing considered.

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `hygen`

<a name="hygen-role"></a>

#### Role of `hygen` in the repo

- to generate code using CLI commands and prompts in the terminal
- to modify existing code using CLI commands and prompts in the terminal
- to use `ejs` templates in code generators, so that there is no new
  syntax/format to learn other than `<% %>` and `<%= %>`
- to have quick way to run shell scripts alongside templates
- to be easy to replace since in the ecosystem of code generators there is no
  clear cut. If ever needed, swapping `hygen` will be pretty easy since most of
  the code here is simply `bash` + `ejs` templates + `enquirer`-based CLI
  prompts

<a name="hygen-config"></a>

#### Available `hygen` configuration

- [`<repo root>/infra/devx-and-repo/generators/_templates`](../infra/devx-and-repo/generators/_templates)
  - the templates used to generate code or run code modifications
- [`<repo root>/infra/devx-and-repo/generators/.hygen.js`](../infra/devx-and-repo/generators/.hygen.js)

  - defines helper functions that can be used in templates
  - tweaks of `hygen` behaviour for better developer experience
    - custom logger to ignore some noise from the logs
    - additional variables passed to templates
    - we don't use the default `prompt.js` array export, instead we export a
      `prompt` function that accepts the CLI args and must return the full input
      for the generator. This is to allow:
      1. easy replacement of the prompt library to other like
         `@inquirer/prompts` or `prompts`
      2. simple conditional prompts based on CLI args & user input

- [`<repo root>/infra/devx-and-repo/generators/extra-template-vars.js`](../infra/devx-and-repo/generators/extra-template-vars.js)
  - constants made available to all templates
- [`<repo root>/infra/devx-and-repo/generators/patches`](../infra/devx-and-repo/generators/patches)
  - fixing known issues, description in `<repo root>/package.json5`

#### Possible alternatives of `hygen`

- `yeoman` generators
- `plop`

`hygen` was chosen because:

1. extremely small API surface, aka simple documentation & small learning scope
2. if ever needed, swapping `hygen` will be pretty easy since most of the code
   here is simply `bash` + `ejs` templates + `enquirer`-based CLI prompts
3. templating is done via `ejs` which simply is JS inside `<% %>` tags, so no
   extra syntax to learn
4. first-class support to executing shell scripts on generator input. Also
   scripts are defined in a way that resembles github actions `run` step
   property
5. you can customize almost all parts of `hygen` via `.hygen.js` file

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `git` hooks

<a name="git-hooks-role"></a>

#### Role of `git` hooks in the repo

- to run code checks & tests locally for faster discovery & iteration over
  problems
- to reduce CI cost by early detection of problems

<a name="git-hooks-config"></a>

#### Available `git` hooks configuration

- [`<repo root>/.githooks`](../.githooks)
  - configures which `package.json` scripts will be run for each project, and
    then runs those
  - runs checks for conventions
- [`<repo root>/infra/devx-and-repo/repo-shell-scripts`](../infra/devx-and-repo/repo-shell-scripts)
  - includes bash functions that are used during GitHub CI but also in git hooks

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `github` CI _(workflows & actions)_

<a name="github-ci-role"></a>

#### Role of `github` CI in the repo

- to run code checks on all changes between a branch and the default, not just 1
  commit
- to run tests on all changes between a branch and the default, not just 1
  commit
- to orchestrate when those checks are run or cancelled via GitHub concurrency
  settings
- to prevent race conditions between automatic releases and PRs (_which can both
  change the default branch_) via GitHub concurrency settings & Merge Queue
- to inform developers if their PRs will produce `npm` releases
- to verify the build of the projects pass in the environment that will be used
  for release
- to trigger specific CI workflows only when certain projects are affected or
  have new upcoming releases

<a name="github-ci-config"></a>

#### Available `github` CI configuration

- [`<repo root>/.github`](../.github)
- [`<repo root>/infra/devx-and-repo/repo-shell-scripts`](../infra/devx-and-repo/repo-shell-scripts)
  - includes bash functions that are used during GitHub CI but also in git hooks
- additionally `actionlint` is used to validate the workflows (_it **DOES NOT**
  validate actions_)

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `VSCode` calibration

<a name="vscode-calibration-role"></a>

#### Role of `VSCode` calibration in the repo

- to integrate better with the popular code editor
- to prevent accidental misconfiguration and bad developer experience

<a name="vscode-calibration-config"></a>

#### Available `VSCode` calibration base configuration

- [`<repo root>/.vscode/settings.recommended.json5`](../.vscode/settings.recommended.json5):
  - recommended settings that can be copied
- [`<repo root>/README.md`](../README.md):
  - instructions for manual configuration

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list)

---

### `JetBrains` calibration

<a name="jetbrains-calibration-role"></a>

#### Role of `JetBrains` calibration in the repo

- to integrate better with the popular line of IDEs
- to prevent accidental misconfiguration and bad developer experience

<a name="jetbrains-calibration-config"></a>

#### Available `JetBrains` calibration base configuration

- [`<repo root>/.idea/externalDependencies.xml`](../.idea/externalDependencies.xml):
  - list of plugins developers will be prompted to install
- [`<repo root>/README.md`](../README.md):
  - instructions for manual configuration

<p> </p>

<p> </p>

[⬅️️ Back to the list of tools 🧰](../README.md#tools-list) —
[⬆️ Back to top nav ⬆️](../README.md#breakproof-nav)
