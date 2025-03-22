import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { getJestConfig } from '@repo/jest-base-isolated/jest.config.base.angular';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectSpecificJestSetup = path.join(process.cwd(), 'jest.setup.ts');

/**
 * The Jest configuration object, defining how Jest should run tests in the project.
 * This configuration is referring to tests written in `*.spec.ts` files in the `/src` directory.
 */
/** @type {import('@repo/jest-base-isolated/jest.types').JestConfig} */
const config = {
  ...getJestConfig(__dirname),
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    fs.existsSync(projectSpecificJestSetup)
      ? projectSpecificJestSetup
      : path.join(__dirname, 'jest.setup.ts'),
  ],
};

export default config;
