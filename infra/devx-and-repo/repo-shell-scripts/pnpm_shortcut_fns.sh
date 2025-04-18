#!/usr/bin/env bash
# We intentionally don't put quotes around some subshells $()
# shellcheck disable=SC2046

#;
# Make sure this file is sourced only once
#"
if [ -n "$PNPM_SHORTCUTS_EXIST" ]; then
  return
fi
PNPM_SHORTCUTS_EXIST=1

#;
# Import dependencies
#"
# shellcheck disable=2155
imports() {
  local __DIRNAME=$(dirname -- "${BASH_SOURCE[0]}")
  source "$__DIRNAME/repo_context_vars.sh"
}
imports

#;
# Shortcut to pnpm command targeting packages which builds can be affected
# by the files changed since $GIT_DIFF_BASE.
#
# @params passes through any provided arguments to the underlying pnpm command
#"
pnpm_affected_build_filter() {
  if [ -z "$GIT_DIFF_BASE" ]; then
    echo "Please set the GIT_DIFF_BASE environment variable before running this function"
    exit 1
  fi
  pnpm \
    --aggregate-output \
    $(
      pnpm --silent --workspace-root run repo:pnpm:expand-filters --ignore-devtools --filter="...[$GIT_DIFF_BASE]" \
        --changed-files-ignore-pattern="$NON_TEST_FILES_GLOB" \
        --changed-files-ignore-pattern="$NON_BUILD_FILES_GLOB"
    ) \
    --filter="!@repo/root" \
    "$@"
}

#;
# Shortcut to pnpm command targeting packages which tests can be affected
# by the files changed since $GIT_DIFF_BASE.
#
# @params passes through any provided arguments to the underlying pnpm command
#"
pnpm_affected_test_filter() {
  if [ -z "$GIT_DIFF_BASE" ]; then
    echo "Please set the GIT_DIFF_BASE environment variable before running this function"
    exit 1
  fi
  pnpm \
    --aggregate-output \
    $(
      pnpm --silent --workspace-root run repo:pnpm:expand-filters --ignore-devtools --filter="...[$GIT_DIFF_BASE]" \
        --changed-files-ignore-pattern="$NON_TEST_FILES_GLOB"
    ) \
    --filter="!@repo/root" \
    "$@"
}

#;
# Shortcut to pnpm command targeting packages which include
# files changed since $GIT_DIFF_BASE.
#
# @params passes through any provided arguments to the underlying pnpm command
#"
pnpm_changed_filter() {
  if [ -z "$GIT_DIFF_BASE" ]; then
    echo "Please set the GIT_DIFF_BASE environment variable before running this function"
    exit 1
  fi
  pnpm \
    --aggregate-output \
    --filter="[$GIT_DIFF_BASE]" \
    --filter="!@repo/root" \
    "$@"
}
