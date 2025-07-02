#!/usr/bin/env bash
# output detailed info on what is being executed
set -x
# fail if any commands fail
set -e

# Ensures scripts fail in the pipeline if any command in it fails — not just the last one.
# Example: `false | true` will fail, but previously it would have succeeded.
# This is necessary due to finding out that the `tee` command in this file
# was still executing even if the commands before it failed.
set -o pipefail

if [ -z "$TEST_SCRIPT_NAME" ]; then
  echo "Please set the TEST_SCRIPT_NAME environment variable before running this script"
  exit 1
fi

if [ -z "$LINT_SCRIPT_NAME" ]; then
  echo "Please set the LINT_SCRIPT_NAME environment variable before running this script"
  exit 1
fi

#;
# Import dependencies
#"
# shellcheck disable=2155
imports() {
  local __DIRNAME=$(dirname -- "${BASH_SOURCE[0]}")
  source "$__DIRNAME/pnpm_shortcut_fns.sh"
  source "$__DIRNAME/conventions_shortcut_fns.sh"
}
imports

# make sure package json files are following the repo conventions
validate_package_json

# make sure package files have defined owners
validate_codeowners

# Should do the same as the test job in .github/workflows/_repo-on-change.yaml
# BUT with
pnpm_affected_test_filter --parallel --workspace-concurrency="$(nproc)" --aggregate-output \
  run "$TEST_SCRIPT_NAME"

# Performance Note: Terminal I/O Management
#
# Raw parallel execution of lint tasks can be significantly slower due to:
# 1. Terminal I/O Contention: Multiple processes writing to stdout simultaneously
# 2. Process Scheduling: Node.js event loop gets blocked by stdout writes
# 3. Output Interleaving: Managing concurrent output streams
#
# Piping through `tee` solves this by providing buffered I/O and a single writer process,
# making parallel execution faster than both raw parallel and sequential approaches.
#
# In tests with changes across 4 packages, `tee` improved performance by ~90%
# compared to raw parallel execution. Your results may vary depending on the
# number of changed files and affected packages.

# Should do the same as the lint job in .github/workflows/_repo-on-change.yaml
# BUT for a subset of the files
pnpm --filter="[$GIT_DIFF_BASE]" \
  --filter='!@repo/citools' \
  --filter='!devtools' \
  --parallel --workspace-concurrency="$(nproc)" --aggregate-output \
  run "$LINT_SCRIPT_NAME" | tee
