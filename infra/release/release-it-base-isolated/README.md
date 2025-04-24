# `@repo/release-it-base-isolated`

Provides detailed base configurations for `release-it` and re-exports
`release-it` types.

It uses `expand-filters` from `@repo/pnpm-helpers` (_the same script that we use
in CI & in git hook_) to only target dependencies of a package have
build-related changes. We do this since some packages that get released to `npm`
might have a dev dependency that doesn't get released to `npm`, so we need to
detect changes in them.

You can find
[info about `release-it` in the documentation](../../../docs/tools-details.md#release-it-config)
about the role, config & alternatives of each tool.
