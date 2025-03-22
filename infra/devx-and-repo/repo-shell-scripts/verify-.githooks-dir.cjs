const { execSync } = require("node:child_process");

try {
  /**
   * * * * * * * * DO NOT DISABLE THIS CHECK * * * * * * *
   *
   * LACK OF GIT HOOKS CAN BREAK HOW THIS REPO WORKS & ALL CI WITH IT
   * PLEASE POST breakproof-base-monorepo GitHub repo FOR ANY ISSUES
   *
   */
  if (process.env.GITHUB_ENV) {
    return;
  }
  execSync("git config core.hooksPath | grep '.githooks$'");
} catch (e) {
  try {
    execSync("git config core.hooksPath '.githooks'");
  } catch (e) {
    console.error(
      "Setting up git hooks from <repo root>/.githooks failed. Please report an issue.",
    );
    process.exit(1);
  }
}
