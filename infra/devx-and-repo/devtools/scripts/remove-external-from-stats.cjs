/**
 *
 *
 * The only purpose of this script is to read the compilation-stats.json generated by webpack
 * and remove the external packages from it so that it's easier to analyze the internal dependency graph.
 *
 *
 */
const fs = require('node:fs');
const path = require('node:path');

const STATS_FILE_PATH = path.join(process.cwd(), 'dist/compilation-stats.json');
const stats = require(STATS_FILE_PATH);

const IGNORE_MODULES_STARTING_WITH = ['webpack/', 'external '];

stats.modules = stats.modules.filter((m) => {
  return !IGNORE_MODULES_STARTING_WITH.some((prefix) =>
    m.name.startsWith(prefix),
  );
});

stats.chunks = stats.chunks.map((chunk) => ({
  ...chunk,
  modules: chunk.modules.filter((m) => {
    return !IGNORE_MODULES_STARTING_WITH.some((prefix) =>
      m.name.startsWith(prefix),
    );
  }),
}));

fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(stats, null, 2));
// eslint-disable-next-line no-console -- Intentionally logging to console
console.log(
  `Successfully removed external packages from ${STATS_FILE_PATH} json file`,
);
