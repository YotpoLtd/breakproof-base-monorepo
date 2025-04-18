import * as path from 'node:path';

import { Eta } from 'eta';

import { fs } from '#zx';

const templateParser = new Eta({
  autoEscape: false,
  autoTrim: false,
  useWith: true,
});

export const createTemplateRenderer =
  (scriptDir: string) =>
  async (filePath: string, data: Record<string, unknown>) => {
    const templateContents = await fs.readFile(
      path.resolve(scriptDir, filePath),
      'utf-8',
    );
    return (
      await templateParser.renderStringAsync(templateContents, data)
    ).trim();
  };
