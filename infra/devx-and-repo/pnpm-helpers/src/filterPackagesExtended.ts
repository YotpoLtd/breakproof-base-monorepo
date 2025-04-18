import * as path from 'node:path';

import {
  filterPkgsBySelectorObjects,
  type PackageGraph,
  type PackageSelector,
  parsePackageSelector,
} from '@pnpm/filter-workspace-packages';
import { findWorkspaceDir } from '@pnpm/find-workspace-dir';
import { type ProjectRootDir } from '@pnpm/types';
import {
  findWorkspacePackagesNoCheck,
  type Project,
} from '@pnpm/workspace.find-packages';
import { createPkgGraph, type PackageNode } from '@pnpm/workspace.pkgs-graph';

interface ParseFilterOptions {
  filterArgs: Array<string>;
  workspaceDir: string;
  ignoreDevtools?: boolean;
}

type FilteringOptions = Parameters<typeof filterPkgsBySelectorObjects>[2];

interface PackageSelectorExtended extends PackageSelector {
  onlyDirectParents?: boolean;
  onlyDirectChildren?: boolean;
}

interface GetSelectedGraphOptions {
  packages: Array<Project>;
  selectors: Array<PackageSelectorExtended>;
  filteringOptions: FilteringOptions;
}

interface MakeDevtoolsAwareGraphCreatorOptions {
  ignoreDevtools?: boolean;
  graphCachePerUniqueOptions: Map<string, unknown>;
}

export interface FilterPackagesExtendedOptions {
  filter: Array<string>;
  ignoreDevtools?: boolean;
  changedFilesIgnorePattern?: Array<string>;
}

/**
 * Extends `parsePackageSelector` from `@pnpm/filter-workspace-packages` by:
 * 1. Understanding `... < ` prefix which means "select only parent dependants"
 * 2. Understanding ` > ...` suffix which means "select only children from dependencies"
 * 3. When passing a path or glob, make it relative to workspace root unless it's absolute
 */
const parsePnpmFilterArgs = ({
  filterArgs,
  ignoreDevtools,
  workspaceDir,
}: ParseFilterOptions): Array<PackageSelectorExtended> =>
  filterArgs.map((filterStringRaw) => {
    let filterString = filterStringRaw.trim();

    const isExclusion = filterStringRaw[0] === '!';
    if (isExclusion) {
      filterString = filterString.slice(1);
    }

    const hasOnlyDirectParents = filterString.startsWith('... < ');
    if (hasOnlyDirectParents) {
      filterString = `...${filterString.slice(6)}`;
    }

    const hasOnlyDirectChildren = filterString.endsWith(' > ...');
    if (hasOnlyDirectChildren) {
      filterString = `${filterString.slice(0, -6)}...`;
    }

    const selectorRaw = parsePackageSelector(
      `${isExclusion ? '!' : ''}${filterString}`,
      '',
    );
    return {
      ...selectorRaw,
      // forcefully ignore devDependencies if we want to ignore devtools when building the graph of packages
      followProdDepsOnly: Boolean(ignoreDevtools),
      onlyDirectParents: hasOnlyDirectParents,
      ...(selectorRaw.parentDir && {
        parentDir: !selectorRaw.parentDir.startsWith('/')
          ? path.resolve(workspaceDir, selectorRaw.parentDir)
          : selectorRaw.parentDir,
      }),
      // any non-absolute {<glob/path>} selector will be made relative to workspace root
      onlyDirectChildren: hasOnlyDirectChildren,
    };
  });

const getSelectedGraph = async ({
  packages,
  selectors,
  filteringOptions,
}: GetSelectedGraphOptions): Promise<PackageGraph<Project>> => {
  const finalSelectedProjectsGraph = {};
  for (const selector of selectors) {
    const exactMatchingGraph = (
      await filterPkgsBySelectorObjects(
        packages,
        [
          {
            ...selector,
            excludeSelf: false,
            includeDependencies: false,
            includeDependents: false,
          },
        ],
        filteringOptions,
      )
    ).selectedProjectsGraph;

    const selectorProjectsGraph: PackageGraph<Project> = selector.excludeSelf
      ? {}
      : { ...exactMatchingGraph };

    const dependentsGraph = !selector.includeDependents
      ? {}
      : (
          await filterPkgsBySelectorObjects(
            packages,
            [{ ...selector, excludeSelf: true, includeDependencies: false }],
            filteringOptions,
          )
        ).selectedProjectsGraph;

    const dependenciesGraph = !selector.includeDependencies
      ? {}
      : (
          await filterPkgsBySelectorObjects(
            packages,
            [{ ...selector, excludeSelf: true, includeDependents: false }],
            filteringOptions,
          )
        ).selectedProjectsGraph;

    for (const [
      workspacePackagePath,
      workspacePackageGraphNode,
    ] of Object.entries<PackageNode<Project>>({
      ...dependentsGraph,
      ...dependenciesGraph,
    })) {
      if (workspacePackagePath in selectorProjectsGraph) {
        continue;
      }

      let shouldInclude =
        !selector.onlyDirectParents && !selector.onlyDirectChildren;

      if (
        !shouldInclude &&
        workspacePackagePath in dependentsGraph &&
        selector.onlyDirectParents
      ) {
        const isDirectParent = (
          Object.keys(exactMatchingGraph) as Array<ProjectRootDir>
        ).some((alreadySelectedPackageGraphNodePath) =>
          workspacePackageGraphNode.dependencies.includes(
            alreadySelectedPackageGraphNodePath,
          ),
        );
        shouldInclude = isDirectParent;
      }

      if (
        !shouldInclude &&
        workspacePackagePath in dependenciesGraph &&
        selector.onlyDirectChildren
      ) {
        const isDirectChild = Object.values(exactMatchingGraph).some(
          (alreadySelectedPackageGraphNode) =>
            (
              alreadySelectedPackageGraphNode as PackageNode<Project>
            ).dependencies.includes(workspacePackagePath as ProjectRootDir),
        );
        shouldInclude = isDirectChild;
      }

      if (shouldInclude) {
        selectorProjectsGraph[workspacePackagePath as ProjectRootDir] =
          workspacePackageGraphNode;
      }
    }

    if (selector.includeDependents && selector.includeDependencies) {
      for (const dependentPath of Object.keys(dependentsGraph)) {
        if (selectorProjectsGraph[dependentPath as ProjectRootDir]) {
          const dependantDependencies = await getSelectedGraph({
            packages,
            selectors: parsePnpmFilterArgs({
              filterArgs: [
                `{${dependentPath}}^${selector.onlyDirectChildren ? ' > ' : ''}...`,
              ],
              ignoreDevtools: Boolean(selector.followProdDepsOnly),
              workspaceDir: filteringOptions.workspaceDir,
            }),
            filteringOptions,
          });
          Object.assign(selectorProjectsGraph, dependantDependencies);
        }
      }
    }

    Object.assign(finalSelectedProjectsGraph, selectorProjectsGraph);
  }

  return finalSelectedProjectsGraph;
};

const makeDevtoolsAwareGraphCreator = ({
  ignoreDevtools,
  graphCachePerUniqueOptions,
}: MakeDevtoolsAwareGraphCreatorOptions) => {
  const serializeGraphOptions = (options: Record<string, unknown>) =>
    JSON.stringify(options);

  return (
    packageList: Array<Project>,
    createPkgGraphOptions: Parameters<typeof createPkgGraph>[1],
  ) => {
    const graphOptionsKey = serializeGraphOptions({
      ...createPkgGraphOptions,
      ignoreDevtools,
    });
    if (graphCachePerUniqueOptions.has(graphOptionsKey)) {
      return graphCachePerUniqueOptions.get(graphOptionsKey);
    }
    let finalPackageList = packageList;
    if (ignoreDevtools) {
      finalPackageList = packageList.map((pkg) => {
        const devDependencies = pkg.manifest.devDependencies || {};
        const devtoolsDependencies =
          (pkg.manifest as { devtoolsDependencies: Array<string> })
            .devtoolsDependencies || [];

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
                Object.entries(devDependencies).filter(([devDependencyName]) =>
                  devtoolsDependencies.includes(devDependencyName),
                ),
              ),
            },
          },
        };
      });
    }
    const graph = createPkgGraph(finalPackageList, createPkgGraphOptions);
    // graphCachePerUniqueOptions.set(graphOptionsKey, graph);
    return graph;
  };
};

/**
 * CSS selectors:
 * '* < pakagename > *' -> '...pakagename...', onlyChildren, onlyParents
 * '* pakagename > *' -> '...pakagename...', onlyChildren
 * '* pakagename *' -> '...pakagename...'
 *
 * NOT YET:
 * --filter-build='' -> no devtools + ignore lint & test  changed files
 * --filter-test='' -> no devtools (besides test ones?) + ignore lint changed files
 * --filter-code-check='' -> only
 */
export async function filterPackagesExtended({
  filter,
  ignoreDevtools = false,
  changedFilesIgnorePattern,
}: FilterPackagesExtendedOptions): Promise<
  Record<string, PackageNode<Project>>
> {
  const workspaceDir = String(await findWorkspaceDir(process.cwd()));
  const allPackages = await findWorkspacePackagesNoCheck(workspaceDir);

  const packageSelectors = parsePnpmFilterArgs({
    filterArgs: filter,
    ignoreDevtools,
    workspaceDir,
  });

  const inclusionPackageSelectors = packageSelectors.filter(
    (selector) => !selector.exclude,
  );
  const exclusionPackageSelectors = packageSelectors
    .filter((selector) => selector.exclude)
    .map((selector) => ({
      ...selector,
      exclude: false,
    }));

  const graphCachePerUniqueOptions = new Map();
  const filteringOptions = {
    workspaceDir,
    ...(changedFilesIgnorePattern && { changedFilesIgnorePattern }),
    createPkgGraph: makeDevtoolsAwareGraphCreator({
      ignoreDevtools,
      graphCachePerUniqueOptions,
    }),
    useGlobDirFiltering: true,
  };

  const includedGraph = await getSelectedGraph({
    selectors: inclusionPackageSelectors,
    packages: allPackages,
    filteringOptions,
  });

  const excludedGraph = await getSelectedGraph({
    selectors: exclusionPackageSelectors,
    packages: allPackages,
    filteringOptions,
  });

  const finalGraph = Object.fromEntries(
    Object.entries(includedGraph).filter(([path]) => !(path in excludedGraph)),
  );

  return finalGraph;
}
