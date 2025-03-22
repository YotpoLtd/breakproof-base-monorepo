# `@repo/circular-dependency-workaround`

There are packages like `eslint-base-isolated` that are very fundamental and because of that, they are likely to be used
by all other packages even those that `eslint-base-isolated` depends on.

This creates a circular dependency.

To avoid that, we cannot declare them as real dependencies in `package.json`. Instead, we need to work around the normal
import `node_modules` mechanism and reach out directly to the absolute path of a file instead of the package name.

This packages exists so that other packages can achieve exactly this: get the absolute path of any other package in the
repo.
a