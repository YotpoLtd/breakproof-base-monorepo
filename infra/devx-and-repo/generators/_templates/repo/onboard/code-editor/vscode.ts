import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';

import json5 from 'json5';

// if wondering about the `#...` import see: https://nodejs.org/api/packages.html#subpath-imports
import { printCheck } from '#helpers';

type VScodeSetting = Record<string, unknown>;

export const applyVsCodeRecommendations = async (repoRootDir: string) => {
  const currentVsCodeSettingsPath = path.join(
    repoRootDir,
    '.vscode/settings.json',
  );

  printCheck(`Applying changes to '${currentVsCodeSettingsPath}'`);

  const currentVsCodeSettingsParsed = fs.existsSync(currentVsCodeSettingsPath)
    ? json5.parse<VScodeSetting>(
        String(await fsPromises.readFile(currentVsCodeSettingsPath)),
      )
    : {};

  const recommendedVsCodeSettingsParsed = json5.parse<VScodeSetting>(
    String(
      await fsPromises.readFile(
        path.join(repoRootDir, '.vscode/settings.recommended.json5'),
      ),
    ).replaceAll('<repo root>', repoRootDir),
  );

  const finalVsCodeSettings = `/**
 * @see '<repo root>/settings.recommended.json5' for documentation 
 * of some of those config properties
 */
${JSON.stringify(
  {
    ...currentVsCodeSettingsParsed,
    ...recommendedVsCodeSettingsParsed,
  },
  null,
  2,
)}`;
  await fsPromises.writeFile(currentVsCodeSettingsPath, finalVsCodeSettings);
};
