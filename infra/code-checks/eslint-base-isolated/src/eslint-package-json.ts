import eslintPluginJsonSchemaValidator from 'eslint-plugin-json-schema-validator';
import eslintJsoncPlugin from 'eslint-plugin-jsonc';

import {
  EslintConfig,
  EslintPlugin,
} from '@yotpo-common/shared-linter-config/types';

import packageJsonSchema from './schemas/package.json-schema';

const config: EslintConfig = [
  ...(eslintJsoncPlugin.configs['flat/recommended-with-json5'] as EslintConfig),
  {
    // only top level package.json files
    files: ['package.json'],
    plugins: {
      'json-schema-validator': eslintPluginJsonSchemaValidator as EslintPlugin,
    },
    rules: {
      'json-schema-validator/no-invalid': [
        'error',
        {
          schemas: [
            {
              fileMatch: ['**/*'],
              schema: packageJsonSchema,
            },
          ],
          useSchemastoreCatalog: false,
          mergeSchemas: true, // or ["$schema", "options", "catalog"]
        },
      ],
      'jsonc/sort-keys': [
        'error',
        // For example, a definition for package.json
        {
          pathPattern: '^$', // Hits the root properties
          order: [
            '$schema',
            'name',
            'description',
            'private',
            'version',
            'type',
            'engines',
            'pnpm',
            'packageManager',
            'license',
            'keywords',
            'main',
            'bin',
            'exports',
            'imports',
            'sideEffects',
            'files',
            'scripts',
            'dependencies',
            'optionalDependencies',
            'devDependencies',
            'devtoolsDependencies',
            'peerDependencies',
          ],
        },
        {
          pathPattern: '^(?:dev|peer|optional|devtools)?[Dd]ependencies$',
          order: { type: 'asc' },
        },
      ],
    },
  },
];

export = config;
