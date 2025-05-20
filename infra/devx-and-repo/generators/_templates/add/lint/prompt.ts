import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { getPackages, PackageType } from '#extra-template-vars';
import * as sharedPrompts from '#shared-prompts';

export interface AddLintParams {
  name?: string;
  type?: PackageType;
  hasTypescript?: boolean;
  hasTsConfigNode?: boolean;
  isSandbox?: boolean;
  supportingForProject?: string | false;
  [otherCliArg: string]: string | boolean;
}

/**
 * @see For list of built-in types: https://github.com/enquirer/enquirer/tree/master/lib/prompts
 */
export const params = async ({
  args: cliArgs,
}: {
  args: AddLintParams;
}): Promise<AddLintParams> => {
  const name =
    (cliArgs.name && String(cliArgs.name)) ||
    (await prompts.autocomplete({
      message: 'Which package you want to add code checks to?',
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

  const isSandbox = await sharedPrompts.getIsSandbox(type, cliArgs);
  const supportingForProject = await sharedPrompts.getSupportingForProject(
    type,
    cliArgs,
    isSandbox,
  );

  return {
    name,
    type,
    hasTypescript,
    hasTsConfigNode,
    isSandbox,
    supportingForProject,
  };
};
