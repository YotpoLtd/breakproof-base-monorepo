#!/usr/bin/env bash

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
    --filter-prod="...[$GIT_DIFF_BASE]" \
    --filter-prod="!@repo/root" \
    --changed-files-ignore-pattern="$NON_TEST_FILES_GLOB" \
    --changed-files-ignore-pattern="$NON_BUILD_FILES_GLOB" \
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
    --filter-prod="...[$GIT_DIFF_BASE]" \
    --filter-prod="!@repo/root" \
    --changed-files-ignore-pattern="$NON_TEST_FILES_GLOB" \
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

#;
# Check if the build of the package provided as argument is affected by
# any changed files since $GIT_DIFF_BASE
#
# @param package_name: the target package name
# @return boolean indicating if the package build is affected
#"
pnpm_is_package_build_affected() {
  # get list of all affected
  pnpm_affected_build_filter list --depth -1 \
    `# check if provided argument exists in the list` \
    | grep -q "$1@"
}
