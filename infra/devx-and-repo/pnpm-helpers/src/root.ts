import { findWorkspaceDir } from '@pnpm/find-workspace-dir';

export const getRepoRootDir = async () =>
  String(await findWorkspaceDir(process.cwd()));
