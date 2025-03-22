import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    defineIgnoredPackage({
      package: '@repo/generators',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/shell-scripts',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/dpdm-base-isolated',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/syncpack-base-isolated',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/release-it-base-isolated',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/.github',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/environment',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
    defineIgnoredPackage({
      package: '@repo/eslint-problem-snapshotter',
      reason:
        'Only exists as dependency because one of the goals for the devtools is to be installation shortcut for several other packages',
    }),
  ],
};
