import { $ as $zx, defaults, useBash } from 'zx';

import { getRepoRootDir } from '#helpers';
/**
 * Easy way to run shell commands from nodejs scripts
 * @see https://google.github.io/zx/api
 */

useBash();

/**
 * Until we migrate from hygen (https://github.com/YotpoLtd/breakproof-base-monorepo/issues/45)
 * we need to replicate some of hygen settings in `zx`
 *
 * This is inside a function, to work around the CJS not being able to use top-level await.
 */
const setDefaults = async () => {
  defaults.cwd = await getRepoRootDir();
};
void setDefaults();

export const $runBash = $zx;
export const $runAndShowBash = $runBash({
  verbose: true,
  stdio: ['pipe', 'inherit', 'inherit'],
  env: { ...process.env, FORCE_COLOR: '1' },
});

export { spinner as $spinner, chalk, fs } from 'zx';
