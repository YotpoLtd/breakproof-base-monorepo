---
inject: true
after: devtoolsDependencies
skip_if: "@repo/typescript-base-isolated"
to: "<%- type === PackageType.INFRA_TOOL ? null : `${ h.getPackageDir(name) }/package.json` %>"
---
  "@repo/typescript-base-isolated": "workspace:^",