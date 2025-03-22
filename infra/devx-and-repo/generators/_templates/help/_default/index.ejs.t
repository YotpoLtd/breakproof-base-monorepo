---
message: |

  {bold Generators:}

  {gray # Creates a new package}
  pnpm -w generate {green package} new

  {gray # Enables automatic releases to npm & github for an existing package}
  pnpm -w generate {green add} release

  {gray # Enables the default set of code checks}
  pnpm -w generate {green add} lint

  {gray # Guides you through initialization of the repo right after you forked it}
  pnpm -w generate {green repo} init

  {gray # Guides you through aligning a new project to the repo conventions}
  pnpm -w generate {green repo} audit-package-alignment-to-repo

  {gray # Onboards you as developer}
  pnpm -w generate {green repo} onboard
---