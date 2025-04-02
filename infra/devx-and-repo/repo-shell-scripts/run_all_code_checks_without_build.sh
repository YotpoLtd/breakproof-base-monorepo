#!/usr/bin/env bash

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
validate_package_json || exit 1

# make sure package files have defined owners
validate_codeowners || exit 1

# run the scripts called $LINT_SCRIPT_NAME & $TEST_SCRIPT_NAME
# for affected packages (changed packages and any that depend on them)
pnpm_affected_test_filter \
  --parallel \
  --workspace-concurrency="$(nproc)" \
  run "/^($TEST_SCRIPT_NAME)|($LINT_SCRIPT_NAME)$/" \
  || exit 1
