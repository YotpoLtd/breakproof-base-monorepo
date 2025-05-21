---
inject: true
after: devDependencies
to: <%- h.getPackageDir(name) %>/package.json
---
  "@repo/eslint-base-isolated": "workspace:^",
  "@repo/eslint-problem-snapshotter": "workspace:^",
  "@repo/depcheck-base-isolated": "workspace:^",
  "@repo/lint-staged-base-isolated": "workspace:^",
  "prettier": "3.2.4",
  <% if (hasTypescript && type !== PackageType.INFRA_TOOL) { %>
    "@repo/tsc-problem-snapshotter": "workspace:^",
  <% } %>