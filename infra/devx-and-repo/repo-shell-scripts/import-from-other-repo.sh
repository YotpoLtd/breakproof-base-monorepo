#!/usr/bin/env bash

# fail if any command fails
set -e

# Alias all arguments passed to the current script to a more explicitly named variable
EXTRA_GIT_FILTER_REPO_ARGS=$*

# initialize generic variables
START_BOLD_BRIGHT_BLUE_TEXT='\033[1;34m'
START_BOLD_RED_TEXT='\033[1;31m'
STOP_COLOR_TEXT='\033[0m'
__DIRNAME_RELATIVE=$(dirname -- "${BASH_SOURCE[0]}")
__DIRNAME=$(cd "$__DIRNAME_RELATIVE" && pwd)
cd "$__DIRNAME"

if [[ 
  -z "$TASK_ID" ||
  (
  "$FILTER_REPO_PASSTHROUGH_ARGS" != "true" &&
  (
  -z "$ORIGINAL_REPO_NAME" ||
  -z "$NEW_FINAL_SUBDIR")) ]] \
  ; then
  echo -e "$START_BOLD_RED_TEXT"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo
  echo "You need to set the correct input for this script:"
  echo
  echo " Input method #1"
  echo
  echo "    Set \`FILTER_REPO_PASSTHROUGH_ARGS\` environment variable to 'true' AND pass any arguments to this script that git-filter-repo accepts (https://github.com/newren/git-filter-repo)"
  echo
  echo " Input method #2"
  echo
  echo "   Set the following environment variables:"
  echo
  echo " - ORIGINAL_REPO_NAME — the name of the repository you want to import from"
  echo " - [OPTIONAL] ORIGINAL_SUBDIR — only specify if you want to import a single subdirectory from REPO_NAME and not the entire repo"
  echo " - NEW_FINAL_SUBDIR — the new location in this repository you want to move into"
  echo " - TASK_ID — the ticket number requiring this migration"
  echo
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo -e "$STOP_COLOR_TEXT"
  echo
  echo
  echo "EXAMPLE 1, if you want to import 'lib/discounts' from 'zen-browser/desktop' into 'zen-browser/discounts-lib':"
  echo
  # we expect this to be run via npm so $npm_lifecycle_event should be available
  # shellcheck disable=2154
  echo "   TASK_ID='IVYS-1234' ORIGINAL_REPO_NAME='zen-browser/desktop' ORIGINAL_SUBDIR='lib/discounts' NEW_FINAL_SUBDIR='zen-browser/discounts-lib' pnpm --workspace-root run $npm_lifecycle_event" | pnpm exec highlight --language sh --theme "$__DIRNAME/cli-highlight-theme.json"
  echo
  echo
  echo "EXAMPLE 2, if you want to import entire repo like 'TanStack/router' into 'libs/tanstack-router':"
  echo
  # we expect this to be run via npm so $npm_lifecycle_event should be available
  # shellcheck disable=2154
  echo "   TASK_ID='IVYS-1234' ORIGINAL_REPO_NAME='TanStack/router' NEW_FINAL_SUBDIR='libs/tanstack-router' pnpm --workspace-root run $npm_lifecycle_event" | pnpm exec highlight --language sh --theme "$__DIRNAME/cli-highlight-theme.json"
  echo
  echo "EXAMPLE 3, if you want to fully control arguments to git-filter-repo"
  echo
  # we expect this to be run via npm so $npm_lifecycle_event should be available
  # shellcheck disable=2154
  echo "   TASK_ID='IVYS-1234' ORIGINAL_REPO_NAME='lichess-org/lila' FILTER_REPO_PASSTHROUGH_ARGS=true pnpm --workspace-root run $npm_lifecycle_event --path 'bin' --path 'project'" | pnpm exec highlight --language sh --theme "$__DIRNAME/cli-highlight-theme.json"
  echo
  exit 1
fi

# Cleanup function if script fails
cleanup() {
  echo -e "$START_BOLD_RED_TEXT"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Cleanup triggered due to a failure!"
  echo "Removing temporary 'import-source' git remote..."

  git remote remove import-source > /dev/null 2>&1

  echo "Checking out 'main' branch..."

  git checkout main

  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo -e "$STOP_COLOR_TEXT"
}
# Catch ERR signal to run the cleanup function on any command failure
trap 'cleanup' ERR

# initialize important variables
TMP_DIR="$__DIRNAME/.tmp-import-from-other-repo"

IMPORT_SOURCE_REPO_DIR="$TMP_DIR/repo"
IMPORT_TARGET_REPO_DIR=$(cd "$__DIRNAME/../../.." && pwd)

if [ -z "$ORIGINAL_SUBDIR" ]; then
  NEW_FINAL_SUBDIR="$NEW_FINAL_SUBDIR/"
fi

echo -e "$START_BOLD_BRIGHT_BLUE_TEXT"
echo
echo "---------------------------------------------"
echo "Importing: $ORIGINAL_REPO_NAME/$ORIGINAL_SUBDIR to $IMPORT_TARGET_REPO_DIR/$NEW_FINAL_SUBDIR"
echo "---------------------------------------------"
echo
echo "🚀 Removing left overs from previous attempts..."
echo
echo -e "$STOP_COLOR_TEXT"

rm -rf "$TMP_DIR"

echo -e "$START_BOLD_BRIGHT_BLUE_TEXT"
echo
echo "🚀 Installing the \`git-filter-repo\` in isolated virtual environment..."
echo
echo -e "$STOP_COLOR_TEXT"

python3 -m venv "$__DIRNAME/.tmp-import-from-other-repo/python-venv"
# don't check external shell scripts
# shellcheck disable=1091
source "$__DIRNAME/.tmp-import-from-other-repo/python-venv/bin/activate"
pip3 install git-filter-repo

echo -e "$START_BOLD_BRIGHT_BLUE_TEXT"
echo
echo "🚀 Cloning the 'source' repo & go into its dir..."
echo
echo -e "$STOP_COLOR_TEXT"

git clone "git@github.com:$ORIGINAL_REPO_NAME.git" "$IMPORT_SOURCE_REPO_DIR"
cd "$IMPORT_SOURCE_REPO_DIR"

echo -e "$START_BOLD_BRIGHT_BLUE_TEXT"
echo
echo "🚀 Removing all files & git history from 'source' repo unrelated to the chosen directory..."
echo "🚀 Renaming dir inside 'source' repo to what we want it to be inside the new repo..."
echo
echo -e "$STOP_COLOR_TEXT"

# @see https://github.com/newren/git-filter-repo/blob/main/Documentation/git-filter-repo.txt
if [ "$FILTER_REPO_PASSTHROUGH_ARGS" == 'true' ]; then
  # Intentionally don't quote EXTRA_GIT_FILTER_REPO_ARGS so they are passed as args
  # shellcheck disable=SC2086
  git filter-repo $EXTRA_GIT_FILTER_REPO_ARGS
else
  git filter-repo --path="$ORIGINAL_SUBDIR" --path-rename "$ORIGINAL_SUBDIR":"$NEW_FINAL_SUBDIR"
fi

echo -e "$START_BOLD_BRIGHT_BLUE_TEXT"
echo
echo "---------------------------------------------"
echo "🚀 Executing import..."
echo "---------------------------------------------"
echo
echo -e "$STOP_COLOR_TEXT"

cd "$IMPORT_TARGET_REPO_DIR"
git remote add import-source "$IMPORT_SOURCE_REPO_DIR"
git fetch import-source
IMPORT_SOURCE_REMOTE_DEFAULT_BRANCH=$(git remote show import-source | sed -n 's/^  HEAD branch: *//p')
git checkout -b "$TASK_ID-import-$ORIGINAL_REPO_NAME"
git merge "import-source/$IMPORT_SOURCE_REMOTE_DEFAULT_BRANCH" --allow-unrelated-histories --no-edit
git commit --allow-empty -m "chore: import code from another repo"

echo -e "$START_BOLD_BRIGHT_BLUE_TEXT"
echo
echo "🚀 Cleanup..."
echo "Removing temporary 'import-source' git remote..."
echo
echo -e "$STOP_COLOR_TEXT"

git remote remove import-source

pnpm --workspace-root generate repo audit-package-alignment-to-repo --packageDir="$NEW_FINAL_SUBDIR"
