---
inject: true
after: devtoolsDependencies
skip_if: "@repo/tsconfig-bases"
to: "<%- type === PackageType.INFRA_TOOL ? null : `${ h.getPackageDir(name) }/package.json` %>"
---
  "@repo/tsconfig-bases": "workspace:^",