/**
 * The schema is created using a few tools:
 * - @see https://jsonformatter.org/json-to-jsonschema
 * - @see LLM suggestions
 */

/**
 * If you need to add another nodejs version, edit .nodejs-versions-whitelist.cjs
 */
// @ts-expect-error -- no types for the whitelist
import SUPPORTED_NODEJS_VERSIONS from '../../../../../.nodejs-versions-whitelist.cjs';

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
const ALLOWED_PACKAGE_MANAGER = 'pnpm@9.15.3';

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
  },
  required: ['pnpm', 'packageManager', 'scripts'],
  errorMessage: {
    properties: {
      packageManager: `The \`packageManager\` must exactly be "${ALLOWED_PACKAGE_MANAGER}"`,
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
