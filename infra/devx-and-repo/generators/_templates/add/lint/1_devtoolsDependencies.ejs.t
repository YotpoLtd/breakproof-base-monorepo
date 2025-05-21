---
inject: true
after: devtoolsDependencies
to: <%- h.getPackageDir(name) %>/package.json
---
  "@repo/eslint-base-isolated",
  "@repo/eslint-problem-snapshotter",
  "@repo/depcheck-base-isolated",
  "@repo/lint-staged-base-isolated",
  <% if (hasTypescript && type !== PackageType.INFRA_TOOL) { %>
    "@repo/tsc-problem-snapshotter",
  <% } %>