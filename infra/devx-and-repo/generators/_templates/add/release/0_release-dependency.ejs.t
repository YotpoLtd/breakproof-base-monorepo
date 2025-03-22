---
inject: true
after: devDependencies
skip_if: "@repo/release-it-base-isolated"
to: <%- h.getPackageDir(name) %>/package.json
---
  "@repo/release-it-base-isolated": "workspace:^",
  "tsx": "^4.19.1",