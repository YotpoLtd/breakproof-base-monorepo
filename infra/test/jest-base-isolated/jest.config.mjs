import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import baseJestConfig from './dist/jest.config.base.react.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectSpecificJestSetup = path.join(process.cwd(), 'jest.setup.ts');

/** @type {import('./src/jest.types').JestConfig} */
const config = {
  ...baseJestConfig.default,
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    fs.existsSync(projectSpecificJestSetup)
      ? projectSpecificJestSetup
      : path.join(__dirname, 'jest.setup.ts'),
  ],
};

export default config;
