---
to: "<%- !hasTypescript || hasTsConfigNode ? null : `${ h.getPackageDir(name) }/tsconfig.node.json` %>"
---
{
  "extends": "@repo/tsconfig-bases/tsconfig.node.base.json",
  "include": ["./*"]
}
