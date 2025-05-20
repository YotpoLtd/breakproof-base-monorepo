---
to: "<%- h.getPackageDir(name) %>/depcheck.config.ts"
---
import baseDepsCheckConfig, { defineIgnoredPackage } from '@repo/depcheck-base-isolated/base';

export default {
	...baseDepsCheckConfig,
	ignores: [
		...baseDepsCheckConfig.ignores,
		<% if (type === PackageType.APP) { %>
			defineIgnoredPackage({ package: 'webpack-dev-server', reason: 'webpack-dev-server is used by `webpack serve` internally'}),
			defineIgnoredPackage({ package: 'webpack-cli', reason: 'used by package.json scripts to for development/build'}),
		<% } %>
		<% if (!supportingForProject) { %>
			defineIgnoredPackage({ package: '@jest/globals', reason: 'only used as typescript types (not real runtime code) and provided via mapping in extended base of tsconfig.node.spec.json'}),
		<% } else { %>
			defineIgnoredPackage({ package: '<%- supportingForProject %>', reason: 'the app we run e2e tests for is referenced in package.json scripts'}),
		<% } %>
	]
};
