/**
 * This file is responsible for configuring and setting up the testing environment before tests are run.
 * This file is automatically picked up by Jest and run before any test files are executed.
 */
// eslint-disable-next-line simple-import-sort/imports -- the present and zone.js imports must come before all others.
import 'jest-preset-angular';
import 'zone.js';
import 'zone.js/testing';

import '@repo/jest-base-isolated/jest.setup.base';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().resetTestEnvironment();

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
  },
);
