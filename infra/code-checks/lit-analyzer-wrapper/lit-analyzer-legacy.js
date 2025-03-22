#!/usr/bin/env node
const path = require('node:path');
const moduleAlias = require('module-alias');

/**
 * lit-analyzer v2 is much better than lit-analyzer v1
 *
 * However, v2 works well only with typescript v5, not v4,
 * and in npm we can't force lit-analyzer to use a specific TS version,
 * so we need to force it by..... monkey patching nodejs source code.
 *
 * Of course not ourselves, we are using a npm package that does that: 'module-alias'
 *
 * @see https://github.com/nodejs/node/blob/v14.21.3/lib/internal/modules/cjs/loader.js#L845
 */
moduleAlias.addAlias(
  'typescript',
  path.resolve(__dirname, 'node_modules/typescript'),
);

require(
  `lit-analyzer/${require('lit-analyzer/package.json').bin['lit-analyzer']}`,
);
