---
to: <%- h.getDestinationByType({ type, subtype, name }) %>/depcheck.config.ts
---
import baseDepsCheckConfig <% if (type !== PackageType.LIB) { %>, { defineIgnoredPackage } <% } %> from '@repo/depcheck-base-isolated/base';

export default {
	...baseDepsCheckConfig,
	ignores: [
		...baseDepsCheckConfig.ignores,
		<% if (type !== PackageType.APP || type === PackageType.E2E_APP) { %>
			// see other depcheck.config.ts files in the repo to see how to add ignored dependencies
		<% } %>
		<% if (type === PackageType.APP) { %>
			defineIgnoredPackage({ package: 'webpack-dev-server', reason: 'webpack-dev-server is used by `webpack serve` internally'}),
			defineIgnoredPackage({ package: 'webpack-cli', reason: 'used by package.json scripts to for development/build'}),
		<% } %>
		<% if (type !== PackageType.E2E_APP) { %>
			defineIgnoredPackage({ package: '@jest/globals', reason: 'only used as typescript types (not real runtime code) and provided via mapping in extended base of tsconfig.node.spec.json'}),
		<% } %>
	]
};
