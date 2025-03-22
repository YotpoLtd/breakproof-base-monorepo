---
to: "<%- supportingForProject ? null : `${h.getDestinationByType({ type, subtype, name })}/tsconfig.node.spec.json`%>"
---
{
  "extends": "@repo/jest-base-isolated/tsconfig.node.spec.base.json",
  "include": ["src/*.spec.ts", "./jest.setup.ts"]
}


