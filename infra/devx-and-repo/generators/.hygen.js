require('tsx/cjs');

const path = require('node:path');

const { Logger: DefaultHygenLogger } = require('hygen');
const execa = require('execa');

const extraVars = require('./extra-template-vars');
const helpers = require('./helpers');
const { $runBash } = require('#zx');

/**
 * @type {import('hygen').RunnerConfig}
 * @see defaults: https://github.com/jondot/hygen/blob/v6.2.11/src/bin.ts#L7-L17
 */
module.exports = {
  cwd: $runBash({ sync: true })`pnpm --workspace-root exec pwd`.stdout.trim(),
  templates: path.join(__dirname, '_templates'),
  helpers,
  logger: new DefaultHygenLogger((text) => {
    /**
     * `_default` is internal to hygen, so we don't want to see it in the
     * output.
     */
    // eslint-disable-next-line no-console -- Logging is intentional here
    console.log(text.replace('_default:', ''));
  }),
  /**
   * Fork of the default with 2 changes:
   *
   * 1. Display what shell commands will be executed from a template
   * 2. Display output of those shell commands
   */
  exec: (action, body) => {
    const opts = body && body.length > 0 ? { input: body } : {};
    // eslint-disable-next-line no-console -- Logging is intentional here
    console.log(`Executing shell commands:\n${action}`);
    return execa.command(action, { ...opts, shell: true, stdout: 'inherit' });
  },
  localsDefaults: extraVars,
};
