# `@repo/dpdm-base-isolated`

This package does one simple thing: **installs `dpdm` and _ONLY_ `dpdm`** to
[act as its isolated node.js environment (_as described in the docs_)](../../../docs/monorepo.md#but-how-multiple-nodejs)

It lets other packages run `dpdm` checks using **_this_** package's specific
`node.js` version. It works by providing a script called `dpdm` in its
`package.json` that other packages can call instead of calling `dpdm`:

```shell
# use:
pnpm --filter='@repo/dpdm-base-isolated' run dpdm ....
# instead of:
dpdma ....
```

You can find
[info about `dpdm` in the documentation](../../../docs/tools-details.md#dpdm)
about the role, config & alternatives of each tool.
