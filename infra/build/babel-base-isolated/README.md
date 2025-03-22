# `@repo/babel-base-isolated`

This package does 3 things:

1. provide detailed configuration for `babel` and helpers to get that base
   config
2. contain `babel` plugins used as part of the base config
3. re-export babel types so that you can refer to them in your project configs

You can find [info about `babel`](../../../docs/tools-details.md) about the
role, config & alternatives of each tool.

## Caveats

1. We also install `babel-jest` here which we then refer in
   `@repo/jest-base-isolated`. We do this so that we have a single place to
   install `babel`, its plugins and packages that use it.
2. This package is currently private to this repository, but it can be useful to
   packages outside this repository so it can be made public.
