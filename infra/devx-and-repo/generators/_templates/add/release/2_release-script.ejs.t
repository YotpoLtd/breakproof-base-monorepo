---
inject: true
after: scripts
skip_if: '"release":'
sh: |
  cd <%- cwd %>
  cp -r <%- actionfolder %>/base-files/. <%- h.getPackageDir(name) %>
  pnpm --filter='<%- name %>...' --no-frozen-lockfile install
  # ends with '|| true' because we want to ignore errors when trying to auto-fix lint issues
  pnpm --filter='<%- name %>' --workspace-concurrency=1 \
    exec \
      pnpm --workspace-root run --sequential '/^shared:fix:/' || true

  # we run the same fix command again because, some of the eslint plugin autofixing have buggy
  # logic that cannot fix everything in 1 pass, e.g. the jsonc/sort-keys from eslint-plugin-jsonc
  pnpm --filter='<%- name %>' --workspace-concurrency=1 \
    exec \
      pnpm --workspace-root run --sequential '/^shared:fix:/' || true
  <% if (hasTsConfigNode) {%>
    echo
    echo "--------------------------------------------------------------------------------"
    echo
    echo
    echo "Please make sure your `tsconfig.node.json` include the new file: `release-it.npm.ts`"
    echo
    echo
    echo "--------------------------------------------------------------------------------"
  <% } %>
to: <%- h.getPackageDir(name) %>/package.json
---

	"release": "<% if (type === PackageType.INFRA_TOOL) {%>[ -z \"$IS_MAIN_BREAKPROOF_REPO\" ] || <% } %>pnpm --workspace-root run shared:release --config $PWD/release-it.npm.ts",