import { createPkgGraph } from "@pnpm/workspace.pkgs-graph";
import { findWorkspacePackagesNoCheck } from "@pnpm/workspace.find-packages";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import { filterPackages } from "@pnpm/filter-workspace-packages";
import nopt from "@pnpm/nopt";
import camelCase from "camelcase";

/**
 * @TODO write jsdoc here
 */
async function expand_pnpm_filters() {
  const workspaceDir = await findWorkspaceDir(process.cwd());
  const packages = await findWorkspacePackagesNoCheck(workspaceDir);
  const cliOptionsRaw = nopt({
    filter: [String, Array],
    ["changed-files-ignore-pattern"]: [String, Array],
    ["ignore-devtools"]: Boolean,
  });
  const cliOptions = Object.fromEntries(
    Object.entries(cliOptionsRaw).map(([cliOptionNameKebabCase, value]) => [
      camelCase(cliOptionNameKebabCase),
      value,
    ]),
  );

  console.log({ cliOptions });

  const matchedPackages = await filterPackages(
    packages,
    cliOptions.filter.map((filter) => ({
      filter,
    })),
    {
      workspaceDir,
      createPkgGraph: (packageList, createPkgGraphOptions) => {
        let finalPackageList = packageList;
        if (cliOptions.ignoreDevtools) {
          createPkgGraphOptions.ignoreDevDeps = true;
          finalPackageList = pkgs.map((pkg) => {
            const devDependencies = pkg.manifest.devDependencies || {};
            const devtoolsDependencies =
              pkg.manifest.devtoolsDependencies || [];

            return {
              ...pkg,
              manifest: {
                ...pkg.manifest,
                dependencies: {
                  ...pkg.manifest.dependencies,
                  ...Object.fromEntries(
                    Object.entries(devDependencies).filter(
                      ([devDependencyName]) =>
                        !devtoolsDependencies.includes(devDependencyName),
                    ),
                  ),
                },
                devDependencies: {
                  ...Object.fromEntries(
                    Object.entries(devDependencies).filter(
                      ([devDependencyName]) =>
                        devtoolsDependencies.includes(devDependencyName),
                    ),
                  ),
                },
              },
            };
          });
        }
        return createPkgGraph(finalPackageList, options);
      },
    },
  );
}

expand_pnpm_filters();
