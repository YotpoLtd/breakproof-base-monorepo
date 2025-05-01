---
to: "<%- `${h.getDestinationByType({ type, subtype, name })}/tsconfig.node.json` %>"
---
{
  "extends": "@repo/typescript-base-isolated/tsconfig.node22.transpiled.base.json",
  "include": ["./*"]
  <% if (type === PackageType.E2E_APP) {%>
    , "exclude": ["./cypress.e2e.setup.ts"]
  <% } %>
  <% if (!supportingForProject) {%>
    , "exclude": ["./jest.setup.ts"]
  <% } %>
}

