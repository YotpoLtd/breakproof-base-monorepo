# The breakproof base monorepo

[↬ Repository goals and how it works. ](./docs/after-fork-setup/MAIN_BREAKPROOF_README.md)

## Quick start

> [!IMPORTANT]
>
> After this quick start, please go through the
> [pnpm intro](./docs/pnpm-intro.md)

### Pre-requisites

Install `pnpm` & all white-listed `node.js` versions:

1. Check the required `pnpm` version in top-level `package.json5` in the
   repository, under `engines.pnpm` property

2. Execute:

   ```shell
   # installs pnpm
   export REPO_DIR=$PWD
   cd ~
   curl -fsSL https://get.pnpm.io/install.sh | PNPM_VERSION=<VERSION YOU FOUND IN PACKAGE JSON> sh -
   # installs several nodejs versions, which are listed in <repo root>/.nodejs-versions-whitelist.cjs
   cd $REPO_DIR
   pnpm --workspace-root run repo:install-whitelisted-nodejs-versions
   # install the packages needed for best developer experience like git hooks, linting, generators, etc.
   pnpm --filter="devtools..." install
   ```

> [!IMPORTANT]
>
> **_DO NOT USE_** alternative to the above method to install `pnpm`, a.k.a.:
>
> - don't use `npm` to install `pnpm`
> - don't use `corepack` to install `pnpm`
> - don't use `brew` to install `pnpm`

3. Every time you update your default branch (_e.g._ `main`/`master`) or your
   branch is rebased/merged with latest changes from the default branch, please
   update your dependencies by running:
   ```shell
   pnpm --filter="devtools..." install
   pnpm --filter="<your package name in its package.json>..." install
   ```

<a name="onboarding"></a>

### Onboarding

To get familiar with this repo and to configure the ideal settings for local
development you need to complete an interactive CLI script:

```shell
pnpm --workspace-root run generate repo onboard
```

### Install, import or create your package

#### Installing dependencies of existing package

The `...` parts in the script below are **important**, since those tell `pnpm`
you want to install not only that package but also any of its dependencies from
this repo.

```shell
pnpm --filter="<package name>..." install
```

Another way to do this:

```shell
# 1) to find the path to a package you can run: pnpm --filter="<package name>" exec pwd
cd path/to/your/package
# 2) when you run install from inside a package directory, pnpm also run the installation of its dependencies from this repo
pnpm install
```

#### Creating a new package

```shell
# this will ask you some questions & then automatically generate the starter files for your package
pnpm --workspace-root generate package new
```

Check
[the existing guide on how to create a new package](./docs/pnpm-intro.md#creating-a-new-package-in-the-repo)
in `pnpm` monorepo for more details.

#### Importing a new package from another repository

Check out
[the documentation](./infra/devx-and-repo/repo-shell-scripts/README.md#using-import-from-other-repo)
for:

```shell
pnpm --workspace-root run repo:import-from-other-repo
```

### Develop your package

```shell
# to watch the source code of the package and all of its dependencies
# in the repository for changes and run each of them in dev mode
pnpm --filter="<package name>" run dev:with-deps

#### OR ####

# when you've generated a sandbox application and you want to develop
# the library and the sandbox with a single command
pnpm --filter="<sandbox package name>" run dev:with-lib

#### OR ####

# to watch the source code ONLY of that package for changes and run it in dev mode
pnpm --filter="<package name>" run dev
```

Another way to do this:

```shell
cd path/to/your/package
pnpm run dev # or dev:with-deps or dev:with-lib
```

### Build your package

```shell
pnpm --filter="<selector of package>..." run build
```

Which will build all of its dependencies first and then build the package
itself.

### Test your package

#### Unit tests

```shell
# runs the jest test suite
pnpm --filter="<selector of package>" run test:units:run

#### OR ####

# runs the jest test suite in watch mode
pnpm --filter="<selector of package>" run test:units:dev
```

Another way to do this:

```shell
cd path/to/your/package
pnpm run test:units:run # or test:units:dev
```

#### E2E tests

```shell
# runs the cypress test suite
pnpm --filter="<selector of e2e package>" run test

#### OR ####

# runs the cypress test suite in watch mode TOGETHER WITH RELATED APP from the repo
pnpm --filter="<selector of e2e package>" run dev:with-app

#### OR ####

# runs ONLY THE cypress test suite in watch mode, it doesn't build or serve the app
pnpm --filter="<selector of e2e package>" run dev
```

Another way to do this:

```shell
cd path/to/your/e2e/package
pnpm run test # or dev or dev:with-app
```

### Release your package

In order to make you package automatically released to `npm` registry, all you
need to do is define a script called `release` in the `scripts` section of your
`package.json` file and this will work out of the box.

If you don't have such script, you can add the default script for that using a
generator:

```shell
pnpm --workspace-root generate add release
```

If you want your own script there, it must be compatible with the `release-it`
CLI interface.

## Updating your branch

After you rebase or merge your branch on latest default branch (_e.g._
`main`/`master`) it's important that you:

1. Refresh dependencies:
   `pnpm --filter="<Your package name>..." --filter="devtools..." install`
2. Likely you need to restart your code editor
3. If you get conflicts in `pnpm-lock.yaml`, it's best to entirely accept the
   version from the default branch (_e.g._ `main`/`master`) and rerun the
   install for your changed packages so you re-create the lock file changes.

## Code editor integration

Code editor integration happens automatically during
[the onboarding CLI script](#onboarding).

If you haven't finished this please see the [Onboarding](#onboarding) section
above.

If you have problems or your code editor is not supported you can check out the
[manual steps for integrating code editors](./docs/manual-code-editor-configuration.md).

<a name="typescript-specifics"></a>

#### TypeScript specifics in the monorepo environment

Code editors run one version of TypeScript to show errors in your files. Our
packages can and most likely have different TS versions. To enable TS errors in
your editor we need to compromise and pick one TS version. If you work ONLY on
packages with common typescript, then pick the typescript package in one of
them. In any other case, it makes sense to pick the default TypeScript version
used by the pre-commit & PR checks.

##### TS settings in `JetBrains` IDEs

Search for `ts.external.directory.path` in `<repo root>/.idea/workspace.xml` and
set its value to the absolute path of `<your chosen typescript package>/lib` so
something like
`/Users/peter/projects/my-product-line-b2b-frontend-monorepo/infra/code-checks/lint-staged-base-isolated/node_modules/typescript/lib`

##### TS settings in `VSCode`

Search for `typescript.tsdk` in `.vscode/settings.json` and set its value to the
absolute path of `<your chosen typescript package>/lib` so something like
`/Users/peter/projects/my-product-line-b2b-frontend-monorepo/infra/code-checks/lint-staged-base-isolated/node_modules/typescript/lib`

## Understanding the setup

Take some time to go through the [pnpm intro](./docs/pnpm-intro.md).
