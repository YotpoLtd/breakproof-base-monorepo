# `pnpm` monorepo

## Basics `#1` — the fundamentals

> [!NOTE]
>
> `pnpm` is a `npm` alternative with mostly backward-compatible CLI interface
> that has additional functionality. In other words, it's a ~**superset** of
> `npm`.
>
> A single tool with a small CLI interface which can do what multiple tools
> previously were used for, capable of replacing `nvm`, `npm` and things like
> `nx` 🎉️

The **main 6** added functionalities in `pnpm` (_not an exhaustive list_):

1. 🎯 **Selecting specific packages**

   `pnpm` understands when you have multiple packages inside a single
   repository. So if you want to run `npm` commands, it lets you select which
   from the packages you want to run the commands for. For example: instead a
   single `npm install` for the entire repository you can do
   `pnpm --filter="<selector of packages>" install` which will only run
   `install` for those packages. Same applies for `npm run script-name`, which
   can be `pnpm --filter="<selector of packages>" run script-name`.

2. 📦 **Individual dependencies for each package**

   The packages in a `pnpm` monorepo are treated as real isolated packages. This
   means that you don't have a single `pnpm install` which installs the
   dependencies of all packages in the repo bunched together in a single
   `node_modules`. The dependencies of each package live in the respective
   directory of that package and others can't use them. So you can use whatever
   version of a library you need **&** you don't have to deal with version
   mismatch problems.

3. 📌 pnpm is **not tied to specific `node.js` version**

   In fact the third major functionality is that `pnpm` can manage different
   `node.js` versions on your OS, very much like `nvm` does. This means we don't
   need `nvm` for `pnpm` projects. Additionally, because `pnpm` sits _above_
   `node.js`, we get more up-to-date dependency-management algorithms even for
   the older `node.js` versions that we have.

4. 🗄️ pnpm enables **each package in the same repo to use different `node.js`
   version** 🎉️

   If you want to use higher/lower version of `node.js` for specific package now
   you can. This unlocks gradual upgrades where we use newer technology in one
   area without having to upgrade everything everywhere at once. This is
   especially useful when parts of your project doesn't have to run in the same
   `node.js` as others, like `lint checks`, `e2e tests`, etc. Or when one
   package is intended to run `node` but another in a browser. All you need to
   do is declare the `node.js` version in the `package.json` of your package.

5. 🔗 **Use other unreleased packages from the repo just like you would if they
   were published**

   `pnpm` allows you to link packages with each other in the repository in a
   very intuitive way. If you have `packageA` & `packageB`, and you want
   `packageA` to use `packageB`, then you can simply do:

   ```shell
   cd ./path/to/package-a
   pnpm install packageB
   ```

   **That's it**. This simply creates a directory
   `path/to/packageA/node_modules/packageB` **but** this directory points to the
   actual `packageB` location in the repository. This can be useful for
   developing packages together or organizing your supporting/utility code into
   multiple packages with their own dependencies, **without** having to publish
   them or do weird path-to-package-name mapping.

6. ⚡ **executing multiple scripts in a single command**.

   If you've done `npm run lint` and `npm run test` sequentially, then with
   `pnpm` you can do the same but in parallel by simply executing
   `pnpm run '/^(lint|test)$/'`. This uses a regex to identify the script names.

Given everything pointed out above, `pnpm` (_a single tool_) can do the job of
`nvm`, `npm` and **_even monorepo tools like_** `nx` 🎉️.

The only **incompatible CLI difference** between `npm` and `pnpm` is that the
`npx` command is split into 2:

- use `pnpm exec <some-package-executable>` if you have `<some-package>` in your
  dependencies and you are trying to execute stuff from it
- use `pnpm dlx <some-package-executable>` if you don't have `<some-package>` in
  your dependencies, and you want it downloaded on the fly

## Basics `#2` — using the fundamentals

Let's say you have the following **file structure**:

```
<repository root>/
├── libs/
│   ├── `packageA` (depends on `packageB`)
│   ├── `packageB` (depends on `packageC`)
│   └── `packageC` (no dependencies in repository)
└── apps/
    ├── `appY` (no dependencies in repository)
    └── `appZ` (depends on `packageA`)
```

This means that you have the following **dependency structure/topology**:

```
appY (no dependencies in repository)
appZ
└── depends on -> packageA
    └── depends on -> packageB
        └── depends on -> packageC
```

For the example, let's say every app and every lib have a `package.json` with a
`scripts` section which includes a `dev` script. Something like:

```json
{
  "name": "<name of package>",
  "scripts": {
    "dev": "echo 'running dev script for <name of package>'"
  }
}
```

Given the above, `pnpm` lets you do stuff that you can't with `npm` by itself,
and you would usually need to learn the vast `nx` ecosystem to do. For example:

```shell
# runs the `dev` script ONLY of packageA
pnpm --filter="packageA" run dev

# same as above
cd ./path/to/package/a && pnpm run dev

# runs the `dev` script first for packageC, then for packageB and lastly for packageA (selected package + its dependencies in topological order)
pnpm --filter="packageA..." run dev

# same as above but more verbose:
pnpm --filter="packageA" --filter="packageB" --filter="packageC" run dev

# same as above but using a glob pattern "package*" to match packageA, packageB and packageC
pnpm --filter="package*" run dev

# same as above but forcefully excluding packageC:
pnpm --filter="packageA" --filter="packageB" --filter="!packageC" run dev

# runs the `dev` script of packageA, packageB and packageC IN PARALLEL
pnpm --filter="packageA..." run --parallel dev

# runs the `dev` script ONLY FOR packageC and then for packageB (dependencies of the selected package)
pnpm --filter="packageA^..." run dev

# runs the `dev` script for packageA and THEN for appZ, DOES NOT run the `dev` script for packageB or packageC (selected package + others that depend ON it)
pnpm --filter="...packageA" run dev

# runs the `dev` script first for packageC, then for packageB, then for packageA and lastly for appZ (selected package + its dependencies + others that depend ON the selected package)
pnpm --filter="...packageA..." run dev

# runs the `dev` script all packages in the repository in topological order, if a package doesn't have a `dev` script it will be skipped
pnpm --filter="*" run dev
```

This **_"package selection mechanism"_** is not limited only to running scripts,
you can do the same for any `npm` command like `install`, `publish`, `audit`.

## Basics `#3` — getting efficient

- `pnpm --filter="this-is-the-name-of-my-unique-package" run dev` is equivalent
  to:

  ```shell
  pnpm --filter="*-my-unique-package" run dev

  # or
  pnpm --filter="*-my-unique-package" dev

  # or
  pnpm -F="*-my-unique-package" dev

  # or
  pnpm --filter="{./path/to/package}" dev

  # or
  cd ./path/to/package
  pnpm run dev
  ```

- `pnpm --filter="this-is-the-name-of-my-unique-package..." install` is
  equivalent to:

  ```shell
  pnpm --filter="*-my-unique-package..." install

  # or
  pnpm -F="*-my-unique-package..." install

  # or
  pnpm --filter="{./path/to/package}..." install

  # or
  cd ./path/to/package
  pnpm install
  ```

- Using one package inside another from the repository is as easy as:

  ```shell
  cd <path to some consumer package>
  pnpm install <name of your package>
  ```

  This will add a dependency to the `package.json`, something like:

  ```json
  "dependencies": {
    "<name of package in the repo>": "workspace:^"
  }
  ```

- If you have multiple scripts that you want to run at the same time such as
  `lint` and `test` you can do it by passing a regex to match script names:

  ```shell
  pnpm --filter='<selector of packages>' run --parallel '/^(lint|test)$/'",
  ```

- If you have 2 packages that don't share dependencies, and you select both and
  run a script, `pnpm` will assume it can run the script in parallel since they
  don't depend on each other. If you need to specifically run those in sequence,
  for example when each command needs to modify the same file, you can do:
  ```shell
  pnpm --filter='<selector of packages>' run --sequential <script name that modifies the same file>",
  ```
- There are some useful scripts that are going to be the same for each package.
  How do we define such scripts without having to duplicate their definition
  into each individual `package.json`? You can read about them later in the
  section **"Shared `scripts`"**.

## Other specifics of a `pnpm` monorepo

1. There is no `nx` in the repo. So far there was no need for it since `pnpm`
   has been doing its job.
2. You can use different versions of dependencies in different packages. If you
   have `appA` that uses `typescript@5.3`, you can have `appB` that uses
   `typescript@4.6`
3. What you define in `package.json` as dependencies is the only thing you get
   in `node_modules` of your package. Nested dependencies of your dependencies
   don't float up to the top of your `node_modules`. This helps you avoid
   dependency mis-matches.
4. Peer dependencies of packages **are not** automatically installed. This is
   intentional, so that the developers which are adding a package are aware of
   everything that it brings and are responsible for deciding to install a
   certain peer dependency or to explicitly ignore it in the
   `pnpm.peerDependencyRules` of `<repo root dir>/package.json`
5. If you find a bug in a third-party package, with `pnpm` you can
   [very easily create a fix](https://pnpm.io/cli/patch) (`a patch`) that gets
   automatically applied during the `pnpm install` process.

## Installation & Development of a project inside a `pnpm` monorepo

1. Check the required `pnpm` version in top-level
   `<repo root dir>/package.json`, under `engines.pnpm` property
2. Execute:
   ```shell
   curl -fsSL https://get.pnpm.io/install.sh | PNPM_VERSION=<VERSION YOU FOUND IN PACKAGE JSON> sh -
   ```
3. Pick a package you want to work on.

   ```shell
   # to install this package dependencies and other required packages from this repo
   pnpm --filter="<package name>..." install
   # to install the packages for best developer experience like git hooks, linting, etc.
   pnpm --filter="devtools..." install

   # the above can be also done like so:
   cd ./path/to/package
   pnpm install
   pnpm --filter="devtools..." install

   # or the same as a one-liner
   pnpm --filter="<package name>..." --filter="devtools..." install
   ```

   The `...` bit is important here since it tells `pnpm` you want to install not
   only that package but also any of its dependencies from this repo.

4. Keep in mind that depending on what you are working on (`application` or a
   `library`), you probably have additional packages inside the repository that
   you want to install. The `application` packages usually come with a separate
   `<app name>-e2e` package where `library` packages will likely have a
   `<library name>-sandbox` and `<library name>-sandbox-e2e` packages. Install
   those as well:
   ```shell
   pnpm --filter="<package name>-sandbox..."  --filter="<package name>-sandbox-e2e..." install
   ```
5. Start your package or its sandbox by running the following from any directory
   in the repository:

   ```shell
   pnpm --filter="<package name>" run dev

   # or
   pnpm --filter="<package name>-sandbox" run dev
   ```

   This will start `<package name>` in dev mode **but NOT its dependencies**. If
   you want to also start all of it dependencies in their respective dev mode
   run:

   ```shell
   pnpm --filter="<package name>" run dev:with-deps

   # or
   pnpm --filter="<package name>-sandbox" run dev:with-deps
   ```

   which is pre-defined in the `scripts` section of the `package.json` for your
   package and is a shortcut for:

   ```shell
   pnpm --filter='{.}^...' build && pnpm --filter='{.}...' run --parallel '/^(dev|serve|watch)$/'
   ```

## Building a package in a `pnpm` monorepo

```shell
pnpm --filter="<selector of package>..." build
```

Which will build all of its dependencies first and then build the package
itself. There is also an alias for this:

```shell
cd ./path/to/package
pnpm --workspace-root shared:build:recursive
```

## Tests

```shell
pnpm --filter="name of e2e package" test
```

## Shared `scripts` between packages in the repository

Across the packages in a `pnpm` monorepo you will likely have some useful
scripts that are going to be the same for each package. How do we define such
scripts without having to duplicate their definition into each individual
`package.json`?

We use the top-level
([`<repo root dir>/package.json5`](https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/package.json5#L45-L83))
for that! All of
[their names are prefixed with `shared:`](https://github.com/YotpoLtd/breakproof-base-monorepo/blob/main/package.json5#L45-L83).

Most commonly you would use them by running
`pnpm --workspace-root <shared script name>` from the directory of your package
or from a script defined in the `package.json` of your package.

<a name="creating-a-new-package-in-the-repo"></a>

## Creating a new package in the repo

Run:

```shell
pnpm --workpace-root generate package new
```

Follow the questions in the command line, and you will end up with a new
package.

You will get a package with pre-existing `scripts` section in `package.json`.
You can change those to whatever best fits your package. Some info on the
default behaviour:

- `lint:*` — Those scripts will run multiple other scripts defined in the
  top-level `<repo root dir>/package.json`. And specifically it will run the
  scripts which name begins with `shared:lint:` or `shared:ts:check`
- `build` — builds only the package itself, not its dependencies. See above how
  to build the package and its dependencies
- `dev` — starts the package in dev mode.
- `dev:with-dep` — starts the package + all of its dependencies in dev mode.
- \[`release`\] — optionally if you opted in to have a release-able package you
  will have this release script. If you decide to customize it should, it should
  either be based on the `release-it` library or accept the same CLI arguments.
- `preinstall` — This will prevent team members from accidentally using `npm`
  instead of `pnpm`
- `test:units:run` & `test:units:dev` — Runs the unit tests for the package. The
  `dev` version is for running the tests in watch mode.

## Tips, Tricks & Best practices

### Avoid `.json` configs wherever possible

Prefer `.ts`, `.mjs`, or `.cjs` because:

- they allow comments which are often needed to explain specific settings
- they are easier to extend or programmatically change

### Avoid using webpack aliases, tsconfig paths, jest aliases, etc.

For projects using `Angular` 14+ or not using angular `Angular` at all, prefer
the `imports` and `exports` properties of the `package.json` since this is
native to `node.js` and all the above tools understand it.
