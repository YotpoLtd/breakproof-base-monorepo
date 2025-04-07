---
to: "<%- `${h.getDestinationByType({ type, subtype, name })}/tsconfig.build.json` %>"
---
{
  <% if ((type === PackageType.APP || type === PackageType.E2E_APP) && techStack === TechStack.REACT) { %>
    "extends": "@repo/typescript-base-isolated/tsconfig.browser.react-app.base.json",
  <% } %>
  <% if ((type === PackageType.APP || type === PackageType.E2E_APP) && techStack === TechStack.BASE) { %>
    "extends": "@repo/typescript-base-isolated/tsconfig.browser-app.base.json",
  <% } %>
  <% if (type === PackageType.LIB && techStack === TechStack.REACT) { %>
    "extends": "@repo/typescript-base-isolated/tsconfig.browser.react-lib.base.json",
  <% } %>
  <% if ((type === PackageType.LIB || type === PackageType.INFRA_TOOL) && techStack === TechStack.BASE) { %>
    "extends": "@repo/typescript-base-isolated/tsconfig.browser-lib.base.json",
  <% } %>
  "compilerOptions": {
    <% if (type !== PackageType.E2E_APP) { %>
      "rootDir": "src",
      "outDir": "dist",
    <% } %>
    <% if (type === PackageType.INFRA_TOOL) { %>
      "tsBuildInfoFile": "./node_modules/.cache/tsc/tsconfig.build.tsbuildinfo",
    <% } %>
  },
  "include": [
    "src/**/*.ts"
    <% if (techStack === TechStack.REACT) {%>
      , "src/**/*.tsx"
    <% } %>
    <% if (type === PackageType.E2E_APP) {%>
      , "cypress.e2e.setup.ts"
      , "globals.d.ts"
    <% } %>
  ],
  "exclude": [
    "src/*.spec.ts"
    <% if (techStack === TechStack.REACT) {%>
      , "src/*.spec.tsx"
    <% } %>
  ],
}
