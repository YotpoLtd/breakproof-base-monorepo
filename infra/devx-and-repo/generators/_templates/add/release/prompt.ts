/**
 * @type {{[name: string]: typeof import('enquirer').prompt} }}
 */
import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { getPackages, refreshPackages } from '#extra-template-vars';
import * as sharedPrompts from '#shared-prompts';

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async ({
  args: cliArgs,
}: {
  args: Record<string, string | boolean>;
}) => {
  await refreshPackages();
  const name =
    (cliArgs.name && String(cliArgs.name)) ||
    (await prompts.autocomplete({
      message: 'Which package you want to add release to?',
      choices: (await getPackages()).map((pkg) => pkg.manifest.name),
    }));

  const type = await sharedPrompts.getType(cliArgs);

  const hasTsConfigNode =
    'hasTsConfigNode' in cliArgs
      ? Boolean(cliArgs.hasTsConfigNode)
      : await prompts.toggle({
          message: 'Do you have a file called `tsconfig.node.json`?',
          enabled: `Yes`,
          disabled: 'No, please create it',
          initial: false,
        });

  const releaseFiles =
    cliArgs.releaseFiles ||
    (await prompts.multiselect({
      message: 'What part of the package contents are you planning to release?',
      choices: ['dist', 'lib', 'README.md'],
      initial: ['dist', 'README.md'],
      validate: (selection) =>
        selection.length <= 0 ? 'Select at least one option' : true,
    }));

  return { name, type, releaseFiles, hasTsConfigNode };
};
