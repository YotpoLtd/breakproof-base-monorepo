---
inject: true
after: name
skip_if: devDependencies
to: <%- h.getPackageDir(name) %>/package.json
---

"devDependencies": {

},