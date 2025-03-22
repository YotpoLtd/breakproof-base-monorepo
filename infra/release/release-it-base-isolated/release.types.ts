import type { Config } from 'release-it';

export enum AllowedPrereleaseType {
  ALPHA = 'alpha',
  BETA = 'beta',
  RC = 'rc',
}

/**
 * @see https://github.com/release-it/release-it/blob/main/config/release-it.json
 * @see https://github.com/release-it/release-it/blob/main/README.md
 */
export interface ReleaseItConfig extends Config {
  preRelease?: AllowedPrereleaseType;
}
