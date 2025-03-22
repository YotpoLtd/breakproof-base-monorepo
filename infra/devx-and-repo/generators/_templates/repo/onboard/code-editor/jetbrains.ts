import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';

import chalk from 'chalk';
import prompts from 'enquirer';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import * as json5 from 'json5';

import { HELP_ACTION_TEXT } from '#extra-template-vars';
// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { printCheck, printContactHelp, printError } from '#helpers';

type ParsedComponentElement = {
  ['@_name']?: string;
  ['#text']?: string;
  option?: Array<{ ['@_name']?: string }>;
};

interface WorkspaceXml {
  project: {
    component: Array<ParsedComponentElement>;
  };
}

type ReconfigureFn = (options: {
  repoRootDir: string;
  workspaceXmlContent: string;
  workspaceXmlParsed: WorkspaceXml;
  xmlParser: XMLParser;
  xmlStringifier: XMLBuilder;
}) => string;

const getWorkspaceXmlPath = (repoRootDir: string) =>
  path.join(repoRootDir, '.idea/workspace.xml');

/**
 * Make sure '<repo root>/.idea/workspace.xml' is created by the JetBrains IDE
 */
export const ensureJetBrainsWorkspaceXml = async (repoRootDir: string) => {
  printCheck(chalk.blue(`Checking for <repo root>/.idea/workspace.xml`));
  if (!fs.existsSync(getWorkspaceXmlPath(repoRootDir))) {
    printError(`We couldn't determine if you've already opened this repo with your JetBrains IDE.

`);
    const hasFixedPackageJsonIssues = await prompts.quiz({
      message: `Can you open it ${chalk.italic(`(if you haven't)`)}, and then exit your IDE?`,
      choices: [
        'Done, check again!',
        `I need some help, I will ${HELP_ACTION_TEXT}`,
      ],
      correctChoice: 0,
    });
    if (hasFixedPackageJsonIssues.correct) {
      await ensureJetBrainsWorkspaceXml(repoRootDir);
    } else {
      printContactHelp();
    }
  }
};

// Wrapping text in CDATA is a way to escape text in XML
const wrapInCDATA = (text: string) => `<![CDATA[${text}]]>`;

/**
 * Apply all recommendations to '<repo root>/.idea/workspace.xml'
 */
export const reconfigureWorkspaceXml = async (repoRootDir: string) => {
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
  });
  const xmlStringifier = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    indentBy: '  ',
    suppressEmptyNode: true,
  });

  const workspaceXmlContent = String(
    fs.readFileSync(getWorkspaceXmlPath(repoRootDir)),
  );
  const workspaceXmlParsed = xmlParser.parse(
    workspaceXmlContent,
  ) as WorkspaceXml;

  const finalWorkspaceXmlContent = [
    reconfigureWorkspaceVcsManagerComponent,
    reconfigureWorkspacePropertiesComponent,
  ].reduce(
    (updatedWorkspaceXmlContent, reconfigureFn) =>
      reconfigureFn({
        repoRootDir,
        workspaceXmlContent: updatedWorkspaceXmlContent,
        workspaceXmlParsed,
        xmlParser,
        xmlStringifier,
      }),
    workspaceXmlContent,
  );

  await fsPromises.writeFile(
    getWorkspaceXmlPath(repoRootDir),
    finalWorkspaceXmlContent,
  );
};

/**
 * Updates <component name="VcsManagerConfiguration"> to fit recommended settings for this repo
 */
const reconfigureWorkspaceVcsManagerComponent: ReconfigureFn = ({
  repoRootDir,
  workspaceXmlContent,
  workspaceXmlParsed,
  xmlParser,
  xmlStringifier,
}) => {
  const currentVcsManagerConfigElementParsed =
    (workspaceXmlParsed.project.component.find(
      (componentEl) => componentEl['@_name'] === 'VcsManagerConfiguration',
    ) as ParsedComponentElement) || {
      option: [],
    };

  const recommendedVcsManagerConfigElementParsed = xmlParser.parse(
    fs.readFileSync(
      path.join(
        repoRootDir,
        '.idea/workspace.recommended-VcsManagerConfiguration.xml',
      ),
    ),
  ) as ParsedComponentElement;

  const finalVcsManagerConfigElementParsed = {
    ...currentVcsManagerConfigElementParsed,
    option: [
      ...(recommendedVcsManagerConfigElementParsed.option || []),
      ...(currentVcsManagerConfigElementParsed.option || []).filter(
        (currentVcsOptionElement) =>
          (recommendedVcsManagerConfigElementParsed.option || []).every(
            (recommendedVcsOptionElement) =>
              recommendedVcsOptionElement['@_name'] ===
              currentVcsOptionElement['@_name'],
          ),
      ),
    ],
  };

  const vcsManagerComponentRegex =
    /(<component\s+name="VcsManagerConfiguration"\s*>)[\S\s]*?(<\/component>)/;

  const updatedVcsManagerComponentContents = xmlStringifier.build(
    finalVcsManagerConfigElementParsed,
  ) as string;

  return vcsManagerComponentRegex.test(workspaceXmlContent)
    ? workspaceXmlContent.replace(
        vcsManagerComponentRegex,
        `$1${updatedVcsManagerComponentContents}$2`,
      )
    : workspaceXmlContent.replace(
        '</project>',
        `<component name="VcsManagerConfiguration">${updatedVcsManagerComponentContents}</component>
</project>`,
      );
};

/**
 * Updates <component name="PropertiesComponent"> to fit recommended settings for this repo
 */
const reconfigureWorkspacePropertiesComponent: ReconfigureFn = ({
  repoRootDir,
  workspaceXmlContent,
  workspaceXmlParsed,
}) => {
  const recommendedKeyToStringSettings = json5.parse<Record<string, unknown>>(
    String(
      fs.readFileSync(
        path.join(repoRootDir, '.idea/workspace.recommended-keyToString.json5'),
      ),
    ).replaceAll('<repo root>', repoRootDir),
  );

  const currentSettings = JSON.parse(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know this element exist since jetbrains always creates it
    workspaceXmlParsed.project.component.find(
      (componentEl) => componentEl['@_name'] === 'PropertiesComponent',
    )!['#text']!,
  ) as { keyToString: { [key: string]: string } };

  const propertiesComponentRegex =
    /(<component\s+name="PropertiesComponent"\s*>)[\S\s]*?(<\/component>)/;

  return workspaceXmlContent.replace(
    propertiesComponentRegex,
    `$1${wrapInCDATA(
      JSON.stringify(
        {
          ...currentSettings,
          keyToString: {
            ...currentSettings.keyToString,
            ...recommendedKeyToStringSettings,
          },
        },
        null,
        2,
      ),
    )}$2`,
  );
};

const overwriteFile = async (destinationPath: string, sourcePath: string) => {
  await fsPromises.mkdir(path.dirname(destinationPath), { recursive: true });
  await fsPromises.writeFile(
    destinationPath,
    String(await fsPromises.readFile(sourcePath)),
  );
};

/**
 * Overwrites eslint, prettier and general JS .idea files to fit recommended settings for this repo
 */
export const overwriteJetBrainsFiles = (repoDir: string) => {
  return Promise.all([
    overwriteFile(
      path.join(repoDir, '.idea/jsLinters/eslint.xml'),
      path.join(repoDir, '.idea/eslint.recommended.xml'),
    ),
    overwriteFile(
      path.join(repoDir, '.idea/prettier.xml'),
      path.join(repoDir, '.idea/prettier.recommended.xml'),
    ),
    overwriteFile(
      path.join(repoDir, '.idea/jsLibraryMappings.xml'),
      path.join(repoDir, '.idea/jsLibraryMappings.recommended.xml'),
    ),
  ]);
};

export const applyJetBrainsRecommendations = async (repoRootDir: string) => {
  await ensureJetBrainsWorkspaceXml(repoRootDir);
  printCheck(
    chalk.blue(`Applying changes to '${repoRootDir}/.idea/workspace.xml'`),
  );
  await reconfigureWorkspaceXml(repoRootDir);
  printCheck(chalk.blue(`Overwriting files in '${repoRootDir}/.idea/*'`));
  await overwriteJetBrainsFiles(repoRootDir);
};
