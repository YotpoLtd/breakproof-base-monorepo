---
inject: true
after: scripts
sh: |
  # running prettier to remove any trailing commas in json which will otherwise break strict parsers
  pnpm --workspace-root exec prettier --write "<%- h.getPackageDir(name) %>/package.json"
  cd <%- cwd %>
  cp -r <%- actionfolder %>/base-files/. <%- h.getPackageDir(name) %>
  pnpm --filter='<%- name %>...' --no-frozen-lockfile install
  pnpm --filter "<%- name %>^..." run build
  pnpm --filter='<%- name %>' --parallel --no-reporter-hide-prefix exec pnpm --workspace-root run --sequential '/^shared:fix:/' || true
to: <%- h.getPackageDir(name) %>/package.json
---
  "lint:everything": "pnpm --workspace-root run '/^shared:lint:.*/'",
  "lint:everything:fix-autofixable": "pnpm --workspace-root run --sequential '/^shared:fix:/'",
  "lint:precommit": "pnpm --workspace-root run '/^shared:(staged:lint:.*|lint:dependencies:.*)/'",
  "lint:precommit:fix-autofixable": "pnpm --workspace-root run --sequential '/^shared:staged:fix:/'",
  "lint:github-pr": "pnpm --workspace-root run '/^shared:(github-pr:lint|lint:dependencies:.*)/'",