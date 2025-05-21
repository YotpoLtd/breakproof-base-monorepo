---
to: "<%- type === PackageType.INFRA_TOOL || type === PackageType.E2E_APP ? null : `${h.getDestinationByType({ type, subtype, name })}/src/index.${techStack === TechStack.REACT ? 'tsx': 'ts'}` %>"
---
<% if (type === PackageType.LIB) { %>
  <% if (techStack === TechStack.REACT) { %>
    import * as React from 'react';

    export const ExportedComponent: React.FC = () => <div>Hello from <%- name %>!</div>;
  <% } else {%>
    export const ExportedMessage = 'Hello from <%- name %>!';
  <% } %>
<% } %>

<% if (type === PackageType.APP) { %>
  <% if (techStack === TechStack.REACT) { %>
    import React from 'react';
    import ReactDOM from 'react-dom';
    <% if (isSandbox) { %>
      import { ExportedComponent } from '<%- supportingForProject %>';
    <% } %>
      
    ReactDOM.render(
      <React.StrictMode>
        <% if (isSandbox) { %>
          The '<%- supportingForProject %>' component: <ExportedComponent />
        <% } else { %>
          Hello from <%- name %>!
        <% } %>
      </React.StrictMode>,
      document.getElementById('app')
    );
  <% } else {%>
    <% if (isSandbox) { %>
      import { ExportedMessage } from '<%- supportingForProject %>';
      alert(`The used package import: ${ExportedMessage}`);
    <% } else { %>
      alert('Hello from <%- name %>!');
    <% } %>
  <% } %>
<% } %>