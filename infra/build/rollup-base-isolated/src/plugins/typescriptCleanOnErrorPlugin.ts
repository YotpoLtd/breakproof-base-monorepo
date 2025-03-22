import { existsSync } from 'node:fs';
import fsp from 'node:fs/promises';
import * as path from 'node:path';

import { glob } from 'glob';
import { Plugin, RollupLog } from 'rollup';

const isTSErrorLog = (log: RollupLog): boolean =>
  Boolean(
    log.plugin === 'typescript' &&
      log.pluginCode &&
      typeof log.pluginCode === 'string' &&
      log.pluginCode.startsWith('TS'),
  );

/**
 * Remove output files if there was a TypeScript error
 * This way consumers of this library will fail their build as well.
 */
export function typescriptCleanOnError(): Plugin {
  let hasTsErrors = false;

  return {
    name: 'typescript-clean-on-error',

    buildStart() {
      hasTsErrors = false;
    },

    onLog(_, log) {
      if (isTSErrorLog(log)) {
        hasTsErrors = true;
      }
    },

    /**
     * Prevent output files if there was error, so consumers of this library will fail their build
     * If there is any existing files -> remove them
     */
    generateBundle: {
      order: 'pre',
      async handler(outputOptions, bundle) {
        if (hasTsErrors) {
          // prevent output
          Object.keys(bundle).forEach((fileName) => delete bundle[fileName]);
          // cleanup existing output
          const outputDir = path.resolve(
            process.cwd(),
            String(outputOptions.dir),
          );
          if (existsSync(outputDir)) {
            const outputDirChildren = await glob(`${outputDir}/*`);
            await Promise.all(
              outputDirChildren.map((path) =>
                fsp.rm(path, { recursive: true }),
              ),
            );
          }
        }
      },
    },
  };
}
