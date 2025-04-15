/**
 * The schema is created using a few tools:
 * - @see https://jsonformatter.org/json-to-jsonschema
 * - @see LLM suggestions
 */

/**
 * If you need to add another nodejs version, edit .nodejs-versions-whitelist.cjs
 */
import fs from 'node:fs';
import path from 'node:path';

// @ts-expect-error -- no types for the whitelist
import SUPPORTED_NODEJS_VERSIONS from '../../../../../.nodejs-versions-whitelist.cjs';

const PACKAGE_JSON = JSON.parse(
  String(fs.readFileSync(path.join(process.cwd(), 'package.json'))),
) as {
  devDependencies: Record<string, string>;
};

const NODEJS_VERSION_ERR_MSG = `You need to define ${JSON.stringify({
  pnpm: {
    executionEnv: {
      nodeVersion: `<ONE OF ${SUPPORTED_NODEJS_VERSIONS.join(' or ')}>`,
    },
  },
})}`;

/**
 * Managed by FE infra team
 */
const ALLOWED_PACKAGE_MANAGER = 'pnpm@9.15.9';

export default {
  type: 'object',
  properties: {
    scripts: {
      type: 'object',
      properties: {
        'lint:precommit': {
          type: 'string',
        },
      },
      required: ['lint:precommit'],
      errorMessage: {
        required: {
          'lint:precommit':
            'We need the `lint:precommit` script to run checks for your package',
        },
      },
    },
    pnpm: {
      type: 'object',
      properties: {
        executionEnv: {
          type: 'object',
          properties: {
            nodeVersion: {
              enum: SUPPORTED_NODEJS_VERSIONS,
            },
          },
          required: ['nodeVersion'],
        },
      },
      required: ['executionEnv'],
      errorMessage: {
        _: NODEJS_VERSION_ERR_MSG,
      },
    },
    packageManager: {
      enum: [ALLOWED_PACKAGE_MANAGER],
    },
    ...(PACKAGE_JSON.devDependencies && {
      devtoolsDependencies: {
        type: 'array',
        items: {
          enum: Object.keys(PACKAGE_JSON.devDependencies),
        },
      },
    }),
  },
  errorMessage: {
    properties: {
      packageManager: `The \`packageManager\` must exactly be "${ALLOWED_PACKAGE_MANAGER}"`,
      devtoolsDependencies: `The \`devtoolsDependencies\` array can only contain the package names listed in 'devDependencies'`,
    },
    required: {
      pnpm: NODEJS_VERSION_ERR_MSG,
      scripts:
        'our conventions require you to define scripts section with specific items inside',
      packageManager:
        'Every package needs to define `packageManager` property so we can get pnpm upgrades automatically',
    },
  },
};
