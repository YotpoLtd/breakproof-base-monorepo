import * as path from 'node:path';

import findRoot from 'find-root';
import { ResolverOptions } from 'jest-resolve';

export = (requestedFilePath: string, options: ResolverOptions) => {
  /**
   * `jest-resolve` is by default customizing `conditions` for `resolve.exports`
   * package that it internally uses.
   *
   * This however triggers logic in `jest-resolve` that either includes only the
   * conditions option or only the `browser: false, require: true` option.
   *
   * So the solution is to remove/omit default `conditions` from `jest-resolve`
   *
   * This change came about from looking at how jest-resolve works internally:
   * https://github.com/facebook/jest/blob/285b40d5954fd81e07b02db92185fd317ba92578/packages/jest-resolve/src/defaultResolver.ts
   *
   * The actual resolving is done by a third-party library called
   * `resolve.exports`
   */
  const { conditions, defaultResolver, ...otherOptions } = options;
  /**
   * @see `paths` docs in https://www.npmjs.com/package/resolve
   */
  const modulePaths = (_: string, requestedFromFilePath: string) =>
    [
      // first, we prefer dependnecies from the package that we are testing
      otherOptions.rootDir && path.join(otherOptions.rootDir, 'node_modules'),
      // allow adding extra directory via environment variable
      process.env.EXTRA_JEST_NODE_MODULES,
      // allow the directory of this base config package
      path.join(__dirname, '../node_modules'),
      // if we can't find a dependency, we default to the closest package to the file we import from
      findRoot(requestedFromFilePath),
      // finally, we assume this is a nested dependency and we default to closest parent `node_modules` directory
      requestedFromFilePath.includes('node_modules') &&
        path.join(
          requestedFromFilePath.slice(
            0,
            requestedFromFilePath.lastIndexOf('node_modules'),
          ),
          'node_modules',
        ),
    ].filter(Boolean) as Array<string>;

  const baseResolverOptions = {
    ...otherOptions,
    defaultResolver,
    // disables automatic searching of `node_modules`, we explicitly specify it in `paths` option
    moduleDirectory: [],
    /**
     * Additionally, jest fills an array with `paths` which are used to resolve
     * the requested module (act as node_modules).
     *
     * However, this is too loose and because we have multiple packages with
     * different dependencies using the @repo/jest-base-isolated we want to
     * use such array of 'paths' only if it refers to the directory where the
     * tests were started from.
     *
     * Any other request will go through the natural node_modules ancestor
     * resolution.
     */
    paths: modulePaths as unknown as Required<ResolverOptions>['paths'],
  } satisfies ResolverOptions;

  try {
    return defaultResolver(requestedFilePath, {
      ...baseResolverOptions,
      /**
       * Since we are using a monorepo, let's try and resolve the path without
       * `node_modules` of the current package but instead rely on the parent /
       * main package directories, defined in modulePaths
       */
      moduleDirectory: [],
    });
  } catch (e) {
    const defaultResolution = defaultResolver(requestedFilePath, options);
    // eslint-disable-next-line no-console -- Logging is on purpose here
    console.warn(
      `[strict-resolution] Was not able to resolve "${requestedFilePath}", fallback to jest default resolution result: "${defaultResolution}"`,
    );
    return defaultResolution;
  }
};
