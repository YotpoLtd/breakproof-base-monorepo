import eslintPluginJsonSchemaValidator from 'eslint-plugin-json-schema-validator';
import eslintJsoncPlugin from 'eslint-plugin-jsonc';

import { EslintConfig } from '@yotpo-common/shared-linter-config/types';

import packageJsonSchema from './schemas/package.json-schema';

const config: EslintConfig = [
  // @ts-expect-error -- bad types in package
  ...eslintJsoncPlugin.configs['flat/recommended-with-json5'],
  // @ts-expect-error -- ?????
  {
    // only top level package.json files
    files: ['package.json'],
    plugins: {
      'json-schema-validator': eslintPluginJsonSchemaValidator,
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
            'devDependencies',
            'peerDependencies',
            'optionalDependencies',
            'devtoolsDependencies',
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
