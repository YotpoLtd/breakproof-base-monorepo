---
inject: true
after: name
skip_if: files
to: <%- h.getPackageDir(name) %>/package.json
---
	"files": [
		<% releaseFiles.forEach((filePattern, index) => { %>
			"<%- filePattern %>"<% if (index < releaseFiles.length - 1) { %>,<% } %>
		<% }) %>
	],