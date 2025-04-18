import chalk from 'chalk';
import prompts from 'enquirer';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import {
  getPackages,
  HELP_ACTION_PROMISE_TEXT,
  PackageType,
} from '#extra-template-vars';

export const getType = async (
  cliArgs?: Record<string, string | boolean>,
): Promise<PackageType> =>
  (cliArgs?.type as PackageType) ||
  (await prompts.autocomplete({
    message: 'What type of package is this?',
    choices: Object.values(PackageType).map((value) => ({
      title: value,
      value,
    })),
  }));

export const getIsSandbox = async (
  type: PackageType,
  cliArgs: Record<string, string | boolean>,
): Promise<boolean> =>
  'isSandbox' in cliArgs
    ? Boolean(cliArgs.isSandbox)
    : type === PackageType.APP
      ? await prompts.toggle({
          message: 'Is this a sandbox application?',
          enabled: 'Yes, I want a place to test another package',
          disabled: 'No, this is a standalone application',
          initial: false,
        })
      : false;

export const getSupportingForProject = async (
  type: PackageType,
  cliArgs?: Record<string, string | boolean>,
  isSandbox?: boolean,
): Promise<boolean | string> =>
  cliArgs?.supportingForProject ||
  (isSandbox || type === PackageType.E2E_APP
    ? await prompts.autocomplete<string | false>({
        message:
          type === PackageType.E2E_APP
            ? 'For what application are you doing e2e tests for?'
            : 'Which package you want this application for?',
        choices: [
          ...(type === PackageType.E2E_APP
            ? ([
                { title: '<Application Outside the Repository>', value: false },
              ] as const)
            : []),
          ...(await getPackages()).map((pkg) => ({
            title: pkg.manifest.name!,
            value: pkg.manifest.name!,
          })),
        ],
      })
    : false);

export const createDeveloperQuizOptions = ({
  yes = 'Ok, done',
  no = `I'm not sure. ${HELP_ACTION_PROMISE_TEXT}`,
}: {
  yes?: string;
  no?: string;
} = {}) => [no, `${yes}\n`];

export const COMMON_DEVELOPER_QUIZ_OPTIONS = {
  // The new line at the end of "ok" prevents a bug where enquirer removes the answer of the previous question from the terminal output
  choices: createDeveloperQuizOptions(),
  correctChoice: 1,
} as const satisfies {
  choices: Array<string>;
  correctChoice: number;
};

export const createQuizStepHeader = (stepNumber: number, header: string) => `

------------------
 ${chalk.blueBright(`# Step ${stepNumber}`)}
 ${header}
`;
