---
sh: |
  cd <%- cwd %>

  PACKAGE_JSON_PATH="<%- h.getDestinationByType({ type, subtype, name }) %>/package.json"

  # running prettier to remove any trailing commas in json which will otherwise break strict parsers
  pnpm --workspace-root exec prettier --write "$PACKAGE_JSON_PATH"

  # remove any empty properties
  pnpm node -e "fs.writeFileSync('$PACKAGE_JSON_PATH', JSON.stringify(require('$PACKAGE_JSON_PATH'), (_, value) => (typeof value !== 'object' || Object.keys(value).length) ? value : undefined, 2))"

  cp -r <%- actionfolder %>/base-files/. <%- h.getDestinationByType({ type, subtype, name }) %>
  <% if (type === PackageType.E2E_APP) {%>
    cp -r <%- actionfolder %>/e2e-files/. <%- h.getDestinationByType({ type, subtype, name }) %>
  <% } %>
  pnpm --filter='<%- nameWithScope %>...' --no-frozen-lockfile install
  <% if (type === PackageType.LIB) {%>
    pnpm --workspace-root generate package new \
      --name="sandbox-<%- name %>" \
      --type="<%- PackageType.APP %>" \
      --isSandbox \
      --skipCodeownersCheck \
      --supportingForProject="<%- nameWithScope %>" \
      <%- h.stringifyArguments({ techStack, nodeVersion, npmScope: 'repo' }) %>
  <% } %>
  <% if (type === PackageType.APP) {%>
    pnpm --workspace-root generate package new \
      --npmScope="repo" \
      --name=<%- name %>-e2e \
      --type="<%- PackageType.E2E_APP %>" \
      --skipCodeownersCheck \
      --supportingForProject="<%- nameWithScope %>"
  <% } %>

  pnpm --workspace-root generate add lint <%- h.stringifyArguments(lintArgs) %>
  <% if (hasRelease) {%>
    pnpm --workspace-root generate add release <%- h.stringifyArguments(releaseArgs) %>
  <% } %>

  pnpm --filter='<%- name %>' --workspace-concurrency=1 \
    exec \
      pnpm --workspace-root run --sequential '/^shared:fix:/' || true
to: <%- h.getDestinationByType({ type, subtype, name }) %>/package.json
---
{
  "$schema": "https://json.schemastore.org/package.json",
  "name": "<%- nameWithScope %>",
  "version": "0.0.1",


  <% if (type !== PackageType.E2E_APP && type !== PackageType.APP) { %>
    "main": "./dist/index.js",
  <% } %>


  "pnpm": {
    "executionEnv": {
      <% if (type !== PackageType.E2E_APP) { %>
        "nodeVersion": "<%- nodeVersion %>"
      <% } else { %>
        "nodeVersion": "<%- NODE_VERSION_LATEST %>"
      <% } %>
    }
  },


  "packageManager": "pnpm@9.15.9",


  "scripts": {
    "preinstall": "[ -n \"$(pwd | grep '/node_modules/')\" ] || echo $npm_config_user_agent | grep -q 'pnpm/' || (echo 'PLEASE USE PNPM, not NPM' && exit 1)",
    <% if (!supportingForProject) { %>
      "test": "pnpm run test:units:run",
      "test:units:run": "pnpm --filter=@repo/jest-base-isolated run jest",
      "test:units:watch": "pnpm run test --watch",
      "test:unites:coverage": "pnpm run test --coverage",
    <% } %>
    <% if (type === PackageType.E2E_APP) { %>
      "test": "pnpm --filter='{.}^...' build && pnpm exec concurrently --names='serve,test' --prefix-colors='yellow,blue' --success='command-test' --kill-others 'pnpm run app:serve' 'pnpm run test:e2e:run'",
      "test:e2e:run": "cypress run --browser chrome",
      "test:e2e:dev": "cypress open",
      "dev": "pnpm run test:e2e:dev",
      "dev:with-deps": "pnpm --filter='{.}^...' build && pnpm --filter='{.}...' run --parallel '/^dev:(watch|serve)$/'",
      <% if (supportingForProject) { %>
        "dev:with-app": "pnpm --filter='{.}^...' build && pnpm --filter='.' run --parallel '/^(app:dev-for-e2e|app:serve|test:e2e:dev)$/'",
        "app:dev-for-e2e": "FORCE_DEV_CMD='(dev|build):watch' pnpm --filter='<%- supportingForProject %>' run dev:with-lib",
        "app:serve": "serve -p 8080 --single $(pnpm --filter='<%- supportingForProject %>' exec pwd)/dist",
      <% } %>
    <% } %>
    <% if (type === PackageType.APP) { %>
      "transpile": "webpack",
      "dev": "pnpm --filter='{.}^...' build && pnpm run dev:<%- type === PackageType.APP ? 'serve': 'watch' %>",
      "dev:with-deps": "pnpm --filter='{.}^...' build && pnpm --filter='{.}...' run --parallel '/^dev:(watch|serve)$/'",
      <% if (supportingForProject) { %>
        "dev:with-lib": "pnpm --filter='{.}^...' build && pnpm --filter='.' --filter='<%- supportingForProject %>' run --parallel \"/^${FORCE_DEV_CMD:-dev:(watch|serve)}$/\"",
        "dev:watch": "pnpm run transpile --watch",
      <% } %>
      "dev:serve": "pnpm run transpile serve",
      "build": "pnpm run transpile --env production",
      "build:watch": "pnpm run build --watch",
    <% } %>
    <% if (type === PackageType.INFRA_TOOL || type === PackageType.LIB || hasRelease) { %>
      <% if (type === PackageType.INFRA_TOOL) { %>
        "transpile": "tsc --project ./tsconfig.build.json",
      <% } else { %>
        "transpile": "pnpm --filter=@repo/rollup-base-isolated run rollup --config ./rollup.config.ts",
      <% } %>
      "dev": "pnpm --filter='{.}^...' build && pnpm run dev:watch",
      "dev:with-deps": "pnpm --filter='{.}^...' build && pnpm --filter='{.}...' run --parallel '/^dev:(watch|serve)$/'",
      "build": "pnpm run transpile",
      "dev:watch": "pnpm run transpile --watch",
    <% } %>
    "__SEE_SHARED__": "echo \"You can run any script starting with 'shared:' defined in <repo-root>/package.json by executing `pnpm -w <name of script>` from your package directory\""
  },


  "dependencies": {
    <% if (type === PackageType.E2E_APP) { %>
      "cypress": "^13.16.0",
      "serve": "14.2.4",
    <% } %>
    <% if (supportingForProject) { %>
      "<%- supportingForProject %>": "workspace:^",
    <% } %>
    <% if (type === PackageType.APP && techStack === TechStack.REACT) { %>
      "react": "^16",
      "react-dom": "^16",
    <% } %>
  },


  "devDependencies": {
    "@repo/typescript-base-isolated": "workspace:^",

    <% if (type === PackageType.E2E_APP) { %>
      "@repo/cypress-base-isolated": "workspace:^",
    <% } else { %>
      "@repo/environment": "workspace:^",
    <% } %>

    <% if (type !== PackageType.INFRA_TOOL && type !== PackageType.E2E_APP) { %>
      <% if (type === PackageType.APP) { %>
        "@repo/webpack-base-isolated": "workspace:^",
        "html-webpack-plugin": "^5.6.0",
        "webpack": "5.96.1",
        "webpack-cli": "^5.1.1",
        "sucrase": "^3.35.0",
        "webpack-dev-server": "^5.1.0",
        <% if (techStack === TechStack.REACT) { %>
          "@types/react": "^16",
          "@types/react-dom":  "^16",
        <% } %>
      <% } %>

      <% if (type !== PackageType.APP && techStack === TechStack.REACT) { %>
        "react": "^16",
        "react-dom": "^16",
        "@types/react": "^16",
        "@types/react-dom":  "^16",
      <% } %>

      <% if (type === PackageType.LIB || hasRelease) { %>
        "@repo/rollup-base-isolated": "workspace:^",
      <% } %>

    <% } %>

    <% if (!supportingForProject) { %>
      "@repo/jest-base-isolated": "workspace:^",
    <% } %>

    "typescript": "^5.3.3",
    <% if (type === PackageType.LIB) { %>
      "tslib": "*",
    <% } %>
  },


  "devtoolsDependencies": [
    <% if (!supportingForProject) { %>
      "@repo/jest-base-isolated",
    <% } %>
  ],


  peerDependencies: {

    <% if (type !== PackageType.APP && techStack === TechStack.REACT) { %>
      "react": "^16",
      "react-dom": "^16",
      "@types/react": "^16",
      "@types/react-dom":  "^16",
    <% } %>

    <% if (type === PackageType.LIB) { %>
      "tslib": "*",
    <% } %>

  },


  <% if (type !== PackageType.E2E_APP) { %>
    "sideEffects": [
      "**/*.css"
    ],
  <% } %>
}