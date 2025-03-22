---
to: "<%- type !== PackageType.APP ? null : `${h.getDestinationByType({ type, subtype, name })}/src/index.html` %>"
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1" />
    <title>Sandbox | <%= name %></title>
  </head>
  <body>
    <div id="app" />
  </body>
</html>
