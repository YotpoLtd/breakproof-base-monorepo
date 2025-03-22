const { execSync } = require("node:child_process");
const util = require("node:util");
const fs = require("node:fs");
const path = require("node:path");

/**
 * @see https://github.com/pnpm/pnpm/blob/main/config/config/src/types.ts
 * @see https://github.com/pnpm/pnpm/blob/428915cd9dcfe8c9a3c10c0bc2651dc488d0e828/pnpm/src/cmd/index.ts#L41
 * @see https://github.com/pnpm/pnpm/blob/4ca321903ca7aafb9407675d50b4cec325652b74/cli/parse-cli-args/src/index.ts#L38
 */
const PNPM_CLI_OPTIONS = {
  color: { type: "string" },
  dir: { type: "string" },
  depth: { type: "string" },
  filter: {
    type: "string",
    short: "F",
    multiple: true,
  },
  help: {
    type: "boolean",
    short: "h",
  },
  recursive: {
    type: "boolean",
    short: "r",
  },
  "filter-prod": {
    type: "string",
    multiple: true,
  },
  loglevel: { type: "string" },
  parseable: { type: "boolean" },
  prefix: { type: "string" },
  reporter: { type: "string" },
  stream: { type: "boolean" },
  "aggregate-output": { type: "boolean" },
  "test-pattern": {
    type: "string",
    multiple: true,
  },
  "changed-files-ignore-pattern": {
    type: "string",
    multiple: true,
  },
  "use-stderr": { type: "boolean" },
  "ignore-workspace": { type: "boolean" },
  "workspace-packages": {
    type: "string",
    multiple: true,
  },
  "workspace-root": { type: "boolean" },
  "include-workspace-root": { type: "boolean" },
  "fail-if-no-match": { type: "boolean" },
};

module.exports = {
  /**
   * Returns the pnpm command/action requested using the CLI
   */
  getPnpmCommand: (scriptArguments) => {
    const pnpmCliArgs = process.argv.slice(
      scriptArguments.findIndex((arg) => arg.endsWith("pnpm.cjs")) + 1,
    );
    return util.parseArgs({
      allowPositionals: true,
      allowNegative: true,
      strict: false,
      args: pnpmCliArgs,
      options: PNPM_CLI_OPTIONS,
    }).positionals?.[0];
  },
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
