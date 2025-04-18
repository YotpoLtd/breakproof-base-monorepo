import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { getPackages } from '#extra-template-vars';
import * as sharedPrompts from '#shared-prompts';

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async ({
  args: cliArgs,
}: {
  args: Record<string, string | boolean>;
}) => {
  const name =
    (cliArgs.name && String(cliArgs.name)) ||
    (await prompts.autocomplete({
      message: 'Which package you want to add release to?',
      choices: (await getPackages()).map((pkg) => pkg.manifest.name),
    }));

  const type = await sharedPrompts.getType(cliArgs);

  const hasTypescript =
    'hasTypescript' in cliArgs
      ? Boolean(cliArgs.hasTypescript)
      : await prompts.toggle({
          message: 'Does your package support typescript?',
          enabled: `Yes`,
          disabled: 'No',
          initial: true,
        });

  const hasTsConfigNode =
    'hasTsConfigNode' in cliArgs
      ? Boolean(cliArgs.hasTsConfigNode)
      : !hasTypescript ||
        (await prompts.toggle({
          message: 'Do you have a file called `tsconfig.node.json`?',
          enabled: `Yes`,
          disabled: 'No, please create it',
          initial: false,
        }));

  return { name, type, hasTypescript, hasTsConfigNode };
};
