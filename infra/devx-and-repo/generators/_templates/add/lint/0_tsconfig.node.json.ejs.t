---
to: "<%- !hasTypescript || hasTsConfigNode ? null : `${ h.getPackageDir(name) }/tsconfig.node.json` %>"
---
{
  "extends": "@repo/typescript-base-isolated/tsconfig.node.base.json",
  "include": ["./*"]
}
