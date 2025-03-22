The packages in this directory are split into sub-directories as a way to categorize them.

The sub-directories' names are mostly self-explainatory. The `to-extract-in-infra-repo` contains packages that are going
to be extracted in a `fe-infra`-specific monorepo when we have a base repo-> fork repo structure.

The `node` symlink is pointing to the binary of the default `node.js` version of this repo. It's created
automatically when you run `pnpm install` anywhere.
