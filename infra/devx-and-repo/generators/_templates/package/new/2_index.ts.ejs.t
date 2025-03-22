---
to: "<%- type === PackageType.INFRA_TOOL || type === PackageType.E2E_APP ? null : `${h.getDestinationByType({ type, subtype, name })}/src/index.ts` %>"
---
<% if (type === PackageType.LIB) { %>
	export const ExportedMessage = 'Hello from <%- name %>!';
<% } %>

<% if (isSandbox) { %>
	import { ExportedMessage } from '<%- supportingForProject %>';
<% } %>

<% if (type === PackageType.APP) { %>
	alert(
		<% if (isSandbox) { %>
			`The used package import: ${ExportedMessage}`
		<% } else { %>
			'Hello from <%- name %>!'
		<% } %>
	);
<% } %>