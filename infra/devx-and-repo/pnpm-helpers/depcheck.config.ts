import baseDepsCheckConfig, {
  defineIgnoredPackage,
} from '@repo/depcheck-base-isolated/base';

export default {
  ...baseDepsCheckConfig,
  ignores: [
    ...baseDepsCheckConfig.ignores,
    // see other depcheck.config.ts files in the repo to see how to add ignored dependencies
    defineIgnoredPackage({
      package: '@jest/globals',
      reason:
        'only used as typescript types (not real runtime code) and provided via mapping in extended base of tsconfig.node.spec.json',
    }),
    defineIgnoredPackage({
      package: '@pnpm/worker',
      reason: 'Peer dependency',
    }),
  ],
};
