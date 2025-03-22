/**
 * Not extending the base config to avoid circular dependencies.
 * We want this package not to depend on any other from this repo
 */
export default {
  plugins: ["prettier-plugin-sh"],
  proseWrap: 'always',
  printWidth: 80,
};
