# `@repo/citools`

This package is a helper package for ci checks. It has one job:

**Install the `<tool name>-base-isolated` packages that `shared:*` scripts in
the `<repo root>/package.json5` rely on, so we can safely refer to and use them
in CI environment.**
