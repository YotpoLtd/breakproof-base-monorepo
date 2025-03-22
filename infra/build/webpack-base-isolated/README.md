# `@repo/webpack-base-isolated`

> - @TODO: rspack does not support the `@ngtools/webpack` which is what builds
>   angular apps using webpack
>   - https://rspack.dev/guide/compatibility/plugin
> - @TODO: vite plugins for angular cannot catch up with `@angular/build` OR
>   `@angular-devkit/build-angular` for how it is building angular, so they will
>   always be inferior
>   - https://github.com/analogjs/analog/blob/b54964a334fc4b9c3631825b45568b3df230f4fd/packages/vite-plugin-angular/src/lib/utils/devkit.ts#L54
>   - https://github.com/vikejs/vite-plugin-angular/blob/main/packages/vite-plugin-angular/src/plugin/plugins/buildOptimizerPlugin.ts
>   - https://github.com/nitedani/vite-plugin-angular/blob/main/packages/vite-plugin-angular/src/plugin/plugins/optimizer.plugin.ts
> - TODO: angular uses vite ONLY FOR DEV server, so any vite plugins will only
>   work in dev server
> - see angular docs @TODO: angular uses esbuild ONLY FOR BUILDING, so any
>   esbuild customizations will only work in build time
> - see angular docs So how would module federation work in the future?
> - import maps? how would they work with external angular stuff?
> - module fedration config for both esbuild and vite? But wouldn't the
>   implementation differ?
>   - https://github.com/module-federation/core/tree/main/packages:
>     - https://www.npmjs.com/package/@module-federation/esbuild
>     - https://www.npmjs.com/package/@module-federation/vite

This package does 1 thing:

1. provide detailed base configuration for `webpack` and helpers to get that
   base config

You can find
[info about `webpack` in the documentation](../../../docs/tools-details.md)
about the role, config & alternatives of each tool.

## Caveats

1. This package is currently private to this repository, but it can be useful to
   packages outside this repository so it can be made public.
