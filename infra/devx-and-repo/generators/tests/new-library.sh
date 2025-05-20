#!/usr/bin/env bash

# fail if any command fails
set -e
# print executed commands
set -x

FIRST_NODE_VERSION=$(pnpm --workspace-root node -p 'require("./.nodejs-versions-whitelist.cjs")[0]')
FIRST_NPM_SCOPE=$(pnpm --workspace-root node -p 'require("./.npm-scopes-whitelist.cjs")[0]')
WORKSPACE_ROOT_DIR=$(pnpm --workspace-root exec pwd)

#
#
# TESTING THE GENERATION OF A NEW TECH-AGNOSTIC LIBRARY
# (no framework)
#
#
LIBRARY_NAME='example-test-library'
pnpm --workspace-root generate package new \
  --type='Library' \
  --name="$LIBRARY_NAME" \
  --techStack='base' \
  --nodeVersion="$FIRST_NODE_VERSION" \
  --npmScope="$FIRST_NPM_SCOPE" \
  --skipCodeownersCheck \
  --hasRelease \
  --releaseFiles=dist \
  --releaseFiles=README.md

cd "$WORKSPACE_ROOT_DIR/libs/${LIBRARY_NAME}"
pnpm run lint:everything
cd "$WORKSPACE_ROOT_DIR/apps/sandbox-${LIBRARY_NAME}"
pnpm run lint:everything
cd "$WORKSPACE_ROOT_DIR/apps/sandbox-${LIBRARY_NAME}-e2e"
pnpm run lint:everything

#
#
# TESTING THE GENERATION OF A NEW REACT LIBRARY
#
#
LIBRARY_NAME='example-react-test-library'
pnpm --workspace-root generate package new \
  --type='Library' \
  --name="$LIBRARY_NAME" \
  --techStack='react' \
  --nodeVersion="$FIRST_NODE_VERSION" \
  --npmScope="$FIRST_NPM_SCOPE" \
  --skipCodeownersCheck \
  --hasRelease \
  --releaseFiles=dist \
  --releaseFiles=README.md

cd "$WORKSPACE_ROOT_DIR/libs/${LIBRARY_NAME}"
pnpm run lint:everything
cd "$WORKSPACE_ROOT_DIR/apps/sandbox-${LIBRARY_NAME}"
pnpm run lint:everything
cd "$WORKSPACE_ROOT_DIR/apps/sandbox-${LIBRARY_NAME}-e2e"
pnpm run lint:everything