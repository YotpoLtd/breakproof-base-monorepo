// @ts-expect-error CJS with no types because we don't want to have build process in the <repo root> yet
import NODE_VERSIONS_NO_TYPES from '../../../../.nodejs-versions-whitelist.cjs';
// @ts-expect-error CJS with no types because we don't want to have build process in the <repo root> yet
import NPM_SCOPES_NO_TYPES from '../../../../.npm-scopes-whitelist.cjs';

/**
 * Starting with browsers supported by Yotpo.
 *
 * Verified via: https://browsersl.ist/
 */
export const SUPPORTED_WEB_BROWSERS = [
  'Firefox >= 45',
  'Chrome >= 44',
  'Edge >= 70',
  'Opera >= 42',
  /**
   * iOS means Mobile Safari. And all browsers on iOS use the engine of Safari
   * so Firefox & Chrome on iOS rely on this.
   */
  'iOS >= 8',
  /**
   * The following is added to widen the coverage for other browsers with market share
   */
  '>0.3%',
  'not dead',
];

export enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export enum RuntimeEnv {
  NODE = 'node',
  BROWSER = 'browser',
}

export const SUPPORTED_AUTORESOLVE_FILE_EXTENSIONS = [
  'ts',
  'tsx',
  'js',
  'jsx',
] as const;

export const NODE_VERSIONS = (NODE_VERSIONS_NO_TYPES as Array<string>)
  .sort()
  .reverse();
export const NPM_SCOPES = NPM_SCOPES_NO_TYPES as Array<string>;
