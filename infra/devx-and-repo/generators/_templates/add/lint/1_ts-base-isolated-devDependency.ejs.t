---
inject: true
after: devDependencies
skip_if: '"@repo/typescript-base-isolated": '
to: "<%- !hasTypescript ? null : `${ h.getPackageDir(name) }/package.json` %>"
---
  "@repo/typescript-base-isolated": "workspace:^",