# `@repo/pnpm-helpers`

- Exports functions to access `@pnpm/` package functionality directly
- Provides CLI scripts to extend pnpm abilities

## CLI scripts to extend pnpm abilities

### Problem #1 we want to solve

1. Any `js` dependency manager relies on `package.json` to understand connection
   between packages even in monorepo like this one.
2. Dependencies in `package.json` are grouped in mainly 3 categories:
   - `dependencies`
   - `devDependencies`
   - `peerDependencies`
3. However `devDependencies` as category is very wide and includes build-related
   stuff but also test, lint, and local developer experience stuff. Only
   build-related `devDependencies` affect our production files, the rest does
   not.
4. When we think about CI/CD in a monorepo we usually want to figure out what
   package needs to be released and what apps need to be deployed
5. To do that we rely on `pnpm` ability to list all affected packages since
   specific git commit (_usually the commit from the default branch that we
   started our branch from_)
6. `pnpm` also allow us to ignore changes in `devDependencies` but it's either
   ignoring all `devDependencies` or none. This means we can't specifically
   ignore `devDependencies` that are not related to the build.
7. That's why we introduced a new property in `package.json` called
   `devtoolsDependencies` which must be an array of strings. Each array item
   must be a name of `devDependencies` package that does not affect build,
   releasing or deployment.
8. The CLI in `@repo/pnpm-helpers` help us use the `devtoolsDependencies`
   property when filtering packages during CI/CD

The included CLI script:

1. accepts `--filter=''` arguments like `pnpm` and returns an "_expanded_"
   version of them.
2. extends pnpm filtering capabilities and enables us to exclude the packages
   declared in the `"devtoolsDependencies"` array in `package.json` from the
   total selection

#### Example usage

If the repository only have 3 packages: `a`,`b`,`c` and `c` is a declared in
`devtoolsDependencies` of `a` or `b`:

```shell
$ pnpm rum expand-filters --filter='*'
# output:
--filter='a' --filter='b' --filter='c'

$ pnpm node pnpm-expand-filters.mjs --filter='*' --filter='!b'
# output:
--filter='a' --filter='c'

$ pnpm node pnpm-expand-filters.mjs --filter='*' --ignore-devtools
# output:
--filter='a' --filter='b'
```

### Problem #2 we want to solve

1. `pnpm` filtering allow us to select all ancestors of a package with smth like
   `--filter='...name-of-package'`
2. In some cases we want to select only direct parents or direct children:
   - if the package changed is responsible for checking problems in other
     packages we need to check all packages that directly installs it, a.k.a.
     its parents. We don't need to also check all ancestors if they are not
     directly installing this package.
   - select direct children of a package can be useful when running packages
     together in dev mode or rebuiling

The included CLI script:

1. understands a new filter prefix: `... < ` which means "select only parent
   dependants"
2. understands a new filter prefix: `> ...` which means "select only children
   from dependencies"

#### Example usage

If the repository only have 3 packages: `a`,`b`,`c` where `a` installs `b` and
`b` installs `c`:

```shell
$ pnpm rum expand-filters --filter='... < b'
# output:
--filter='a'

$ pnpm rum expand-filters --filter='... < c'
# output:
--filter='b'

$ pnpm rum expand-filters --filter='a > ...'
# output:
--filter='b'
```

## Functions to access `@pnpm/` package functionality directly

The exported `getAllPackages` helps already running JS code to list all packages
in the repo without having to run `pnpm` & parse bash CLI commands for that.
