const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  /**
   * Returns the pnpm command/action requested using the CLI
   */
  getPnpmPackages: () => {
    try {
      /**
       * If some of the `package.json` files have syntax errors
       * `pnpm list` will fail listing anything
       */
      return JSON.parse(
        String(
          execSync(
            'pnpm --config.ignore-pnpmfile=true --filter="*" list --depth -1 --json',
          ),
        ).trim(),
      );
    } catch (e) {
      /*
       * If some of the `package.json` files have syntax errors
       * `pnpm list` command will fail
       *
       * This script is the fallback where we find the packages on our own
       *
       * 1. find patterns from <repo root>/pnpm-workspace.yaml
       * 2. find any directories with `package.json` that match those patterns
       * 3. parse those `package.json` and output them as an array, add the path of the package as another property
       */
      const pnpmWorkspaceRootDir = String(
        execSync(
          `pnpm --config.ignore-pnpmfile=true --workspace-root exec pwd`,
        ),
      ).trim();
      const pnpmWorkspaceYamlContents = String(
        fs.readFileSync(`${pnpmWorkspaceRootDir}/pnpm-workspace.yaml`),
      );

      const patternLineRegex = /\s+-\s*(.+)/;
      const packageJsonPatterns = pnpmWorkspaceYamlContents
        .match(new RegExp(patternLineRegex.source, "g"))
        .flatMap((patternLine) =>
          patternLine.replace(
            patternLineRegex,
            `${pnpmWorkspaceRootDir}/$1/package.json`,
          ),
        );

      const packageJsonPaths = String(
        // we don't want to trow if some patterns don't match anything, instead lets ignore stderr
        execSync(`ls ${packageJsonPatterns.join(" ")} || true`, {
          shell: "bash",
          stdio: ["ignore", "pipe", "ignore"], // stdin, stdout, stderr
        }),
      )
        .trim()
        .split("\n");

      return packageJsonPaths.flatMap((packageJsonFilePath) => {
        try {
          return {
            ...require(packageJsonFilePath),
            path: path.dirname(packageJsonFilePath),
          };
        } catch (e) {
          return [];
        }
      });
    }
  },
};
