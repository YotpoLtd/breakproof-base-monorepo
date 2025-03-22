#!/usr/bin/env bash

#;
# Make sure this file is sourced only once
#"
if [ -n "$CONVENTIONS_SHORTCUTS_EXIST" ]; then
  return
fi
CONVENTIONS_SHORTCUTS_EXIST=1

#;
# Import dependencies
#"
# shellcheck disable=2155
imports() {
  local __DIRNAME=$(dirname -- "${BASH_SOURCE[0]}")
  source "$__DIRNAME/pnpm_shortcut_fns.sh"
}
imports

#;
# Check if any of the changes include package.json files
#"
has_package_json_changes() {
  if [ -z "$GIT_DIFF_BASE" ]; then
    echo "Please set the GIT_DIFF_BASE environment variable before running this function"
    exit 1
  fi
  git diff --name-only "$GIT_DIFF_BASE" | grep -q 'package\.json$'
}

#;
# Shortcut a couple of commands that validate package.json files
#"
validate_package_json() {
  ! has_package_json_changes && return
  CPU_CORES="$(nproc)"

  pnpm --filter="@repo/syncpack-base-isolated..." install
  pnpm --workspace-root repo:lint:package.json:dependencies || return 1
  pnpm_changed_filter \
    --parallel --workspace-concurrency="$CPU_CORES" --no-reporter-hide-prefix \
    exec pnpm --workspace-root shared:lint:package.json || return 1
}

#;
# Shortcut to a command that validates all changed packages have
# defined owners in <repo root>/.github/CODEOWNERS
#"
validate_codeowners() {
  CPU_CORES="$(nproc)"
  pnpm_changed_filter \
    --parallel --workspace-concurrency="$CPU_CORES" --no-reporter-hide-prefix \
    exec pnpm --workspace-root shared:lint:codeowners || return 1
}
