import { findWorkspacePackagesNoCheck } from '@pnpm/workspace.find-packages';

import { getRepoRootDir } from './root';

export const getAllPackages = async () =>
  findWorkspacePackagesNoCheck(await getRepoRootDir());
