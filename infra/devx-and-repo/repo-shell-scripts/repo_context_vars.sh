#!/usr/bin/env bash

#;
# Make sure this file is sourced only once
#"
if [ -n "$REPO_CONTEXT_VARS_EXIST" ]; then
  return
fi
REPO_CONTEXT_VARS_EXIST=1

NON_TEST_FILES="*.md,.eslintrc*.cjs,eslint.config.cjs,.prettierignore,.prettierrc.mjs,.depcheckrc.cjs,catalog-info.yaml"

export INFRA_PACKAGES_GLOB='./infra/**'
export GITHUB_DIR='./.github'

export NON_BUILD_FILES_GLOB="**/{$NON_TEST_FILES,jest.config.ts,jest.setup.ts,cypress.config.ts,cypress.e2e.setup.ts,*.e2e.ts,*.spec.ts,*.spec.js,*.cy.js,*.cy.ts}"
export NON_TEST_FILES_GLOB="**/{$NON_TEST_FILES}"
