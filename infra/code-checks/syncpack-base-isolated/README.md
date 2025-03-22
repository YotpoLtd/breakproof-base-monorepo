# `@repo/syncpack-base-isolated`

This package does one simple thing: **installs `syncpack` and _ONLY_
`syncpack`** to
[act as its isolated node.js environment (_as described in the docs_)](../../../docs/monorepo.md#but-how-multiple-nodejs)

It lets the `<repo root>/package.json5` use `syncpack` checks using **_this_**
package's specific `node.js` version. It works by providing scripts called
`syncpack` & `syncpack:fix` in its `package.json` that
`<repo root>/package.json5` can call instead of calling `syncpack` directly:

```shell
# use:
pnpm --filter='@repo/syncpack-base-isolated' run syncpack ....
pnpm --filter='@repo/syncpack-base-isolated' run syncpack:fix ....
# instead of:
syncpack ....
```

You can find
[info about `syncpack` in the documentation](../../../docs/tools-details.md#dpdm)
about the role, config & alternatives of each tool.
