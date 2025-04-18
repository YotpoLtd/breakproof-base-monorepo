import { findWorkspaceDir } from '@pnpm/find-workspace-dir';
import { findWorkspacePackagesNoCheck } from '@pnpm/workspace.find-packages';

export const getAllPackages = async () =>
  findWorkspacePackagesNoCheck(String(await findWorkspaceDir(process.cwd())));
