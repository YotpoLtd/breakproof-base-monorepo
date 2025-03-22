---
inject: true
after: name
skip_if: scripts
to: <%- h.getPackageDir(name) %>/package.json
---
  "scripts": {

  },