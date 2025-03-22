---
to: "<%- `${h.getDestinationByType({ type, subtype, name })}/tsconfig.json` %>"
---
{
  /**
  * This file is a working around multiple TS issues:
  * - tsconfigs in references cannot have the same file in their `include` as the main tsconfig
  * - tsconfig with references requires each referenced tsconfig to be composite
  * - tsconfig that are composite cannot follow imported files that are not part of their `include` setting
  */
  "files": [],
  "references": [
    { "path": "./tsconfig.build.json" },
    { "path": "./tsconfig.node.json" }
    <% if (!supportingForProject) {%>
      ,  { "path": "./tsconfig.node.spec.json" }
    <% } %>
  ]
}