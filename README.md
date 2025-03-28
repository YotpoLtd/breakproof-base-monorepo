<picture><img alt="Breakproof Base Repo BETA VERSION" src="./docs/Header.svg" /></picture>

## TLDR-_ish_

1. **❓️What is it**: consider this a template repository but instead of copying
   it, you fork it, and this way you can keep receiving updates simply via `git`

2. **📦️ What's included**: it is monorepo managed only using `pnpm` (_no
   abstraction on top of it_) and it has several packages already in it; each of
   those packages installs only one dependency; this dependency is an
   industry-standard tool like `eslint` or `TypeScript` or `rollup` or `jest`,
   etc. and the package that installs it includes **detailed base
   configuration** for it.

3. **🤔 What's different**: the repo utilizes a lesser known functionality of
   `pnpm` which allows each individual package to choose its own `node.js`
   version; when you combine this with the idea that each existing package
   installs only 1 tool, you essentially get isolated `<tool> + <node.js>`, e.g.
   `eslint + node22` which lets you always execute `eslint` using `node22`, even
   from other packages via
   `pnpm --filter=<PACKAGE NAME THAT INSTALLS TOOL IN IT> run <TOOL NAME>`

4. **🎯 What's the goal**: you focus on **only on your project code**, not on
   maintaining the tooling around it up-to-date or spending hours/days trying to
   make different tools work well together; the tooling for lint & type checks,
   testing, building, CI/CD, etc. is already working, well configured and
   **always up-to-date**; you get that when you install a package from this repo
   that includes a specific tool and then extend the provided tool config;

5. **🔍 How is this achieved**: your project **can lag behind or have newer
   `node.js` version from any of the tools it uses** and this means you can
   safely upgrade only your project, without having to think about upgrading the
   tools; in fact this repository keeps each individual tool up-to-date, you
   simply pull in the changes in your fork and ✨️*voilà* ✨you are using the
   latest & greatest again.

6. **🎁 CI/CD that just works**: if your projects have specific scripts defined
   in their `package.json`, this repo includes the needed GitHub CI/CD workflows
   & git pre-commit hooks that will pick them up and run them at the correct
   time & place; scripts names are not controversial, so things like `build` for
   building, `test` for testing, `relese` for npm release; some script name
   conventions are not typical but are very explicit, e.g.
   `lint:precommit`/`lint:github-pr` for linting at the given event.

<p> </p>

<picture><img alt="GitHub Cover" src="./docs/Diagram.svg" /></picture>

<div align="center">

<a name="breakproof-nav"></a>

💡 [What's the idea?](#the-idea) — 🚀
[Getting started](#getting-started-with-your-breakproof-repo) — 🎯
[Where is this useful?](#purpose) — 🏆
[List of Best Practices](#best-practices-list)

⚙️ [Tools & Configuration](#how-it-works) — ⚖️
[Conventions](#conventions-and-core-principles) — 📋️ [What's next](#whats-next)

<sub>[How can tools use different node.js?](#but-how-multiple-nodejs)</sub>

</div>

<div align="center">

[![ForkButton.png](./docs/ForkButton.svg)](https://github.com/YotpoLtd/breakproof-base-monorepo/fork)
[![Open
`breakproof base repo` in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/YotpoLtd/breakproof-base-monorepo)

</div>

---

<a name="the-idea"></a>

# 💡What's the idea here?

1. 🔀 This is **a repository for frontend projects** and **it's meant to be
   fork-ed**.

2. ⚡ Once you do that, you have your own
   [monorepo](https://en.wikipedia.org/wiki/Monorepo 'Repository intended for multiple projects')
   to develop your frontend projects in, but **now with**:

   1. [**best-practices** _( listed below ⬇️ )_](#best-practices-list) already
      **configured** and **operational**.
      (_[see "🚀 Get Started"](#getting-started-with-your-breakproof-repo)_)
   2. each individual tool running in its own isolated version of `nodej.js`,
      which means **you can upgrade it without having to immediately upgrade
      your project** or vice versa

3. 🌟 When the best practices **_inevitably change_** or tools get outdated, you
   simply pull updates from this base repo into your forked repo, and you will
   once again be using the latest best practices & newer tools, instead of
   spending time re-reconfiguring them yourself.

4. 🛠️ All the applied best practices are achieved using only
   [**industry-standard tools** _( listed below ⬇️ )_](#tools-list) configured
   to _work together_.

5. ⚪ There is **_no abstraction wrapping those tools_** or **their configs**,
   and there is **_nothing that magically injects code_** in them.

6. 🧱 This repo provides a
   [set of conventions](#conventions-and-core-principles) & working base configs
   for the tools, so each individual project can extend & modify them thus
   remaining in full control of its own configuration.

7. 🔄 Each individual tool can be swapped with another as long as it does it's
   job. _([role of each tool is listed below ⬇️](#tools-list)_

8. 📦 (_this one deserves repetition_): Each individual tool runs in its own
   isolated environment with its own `nodejs` version, which means you can
   upgrade it without having to immediately upgrade your project or vice versa

To make things easier (_and to serve as example_), there is
[code generation](./docs/pnpm-intro.md#creating-a-new-package-in-the-repo) that
creates new projects which extend all the base configs.

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="purpose"></a>

## 🎯 Where is this useful? (_purpose_)

Using a fork of this repository as the place to develop your projects is useful
if any of those fit your setup:

- 🗄 You work in a company with large-enough codebase that you cannot regularly
  stop development until you upgrade everything at once. You need **gradual**
  isolated **upgrades**.

- 🔍 You have a legacy codebase that you want to gradually bring up to latest
  standards. You need to be able to split it and focus on one piece at time.

- 👨‍🔧 You have a codebase (_of any size_), and you don't want to spend time
  wiring different tools together just to make your software lifecycle work. And
  then doing the **_same thing again_** when they have new versions. You need
  those processes **already working** and **their upgrades managed** for you.

- 🕊 You want to improve your codebase but cannot fix all problems at once. You
  need to be tolerant of existing problems but forbid new problematic code.

- 🥴 You are tired of learning new configuration formats with each new
  repo-management tool that comes out and then hitting its customization limits.
  You want to **directly deal with the tools** used.

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="getting-started-with-your-breakproof-repo"></a>

# 🚀 Get started with _your_ `breakproof` repo

1. 🔀 **Fork this repo.**

2. 🔀 Initialize your fork with your preferences:

   ```shell
   pnpm --workspace-root generate repo init
   ```

3. 🔀 Onboard yourself and your code editor:

   ```shell
   pnpm --workspace-root generate repo onboard
   ```

4. 🎛️ Tweak the tools in the repo to fit the needs/preferences of your projects:

   - The structure & files of your new projects:
     - [`./.nodejs-versions-whitelist.cjs`](./.nodejs-versions-whitelist.cjs) —
       Define an array of allowed `node.js`
     - [`./.npm-scopes-whitelist.cjs`](./.npm-scopes-whitelist.cjs) — Define an
       array of allowed npm scopes
     - [`./infra/build/environment/src/index.ts`](./infra/build/environment/src/index.ts)
       — Define your target browsers here (_as browserlist queries_)
     - [ `./infra/devx-and-repo/generators/_templates/package/new`](./infra/devx-and-repo/generators/_templates/package/new)
       — the templates that `hygen` uses to generate the files of your new
       projects. versions for your projects, used during code generation & code
       checks (`@scope/<project name>`) for your projects to be used when
       publishing to the npm registry
     - [ `./infra/devx-and-repo/generators/extra-template-vars.ts`](./infra/devx-and-repo/generators/extra-template-vars.ts)
       — some constants that are used during code generation or CLI guides like
       the text or contact channel you want to output for help
   - The base configurations of tools that your project files extend:
     - [`eslint` base configs](./docs/tools-details.md#eslint-config)
       - take a look at the import-order rule where you should define your own
         packages' scopes
     - [`release-it` base config](./docs/tools-details.md#release-it-config) &
       the
       [`conventional-changelog` used by it](./docs/tools-details.md#conventional-changelog-config)
     - [`jest` base config](./docs/tools-details.md#jest-config)
     - [`cypress` base config](./docs/tools-details.md#cypress-config)
     - [`rollup` base config](./docs/tools-details.md#rollup-config)
     - [`babel` base config](./docs/tools-details.md#babel-config)
     - [`webpack` base config](./docs/tools-details.md#webpack-config)
     - [`typescript` base configs](./docs/tools-details.md#typescript-config)
       - special shout out to the `customConditions` in `tsconfig.base.json`,
         where you can define yours or leave
     - _[...all other secondary tools](#tools-list)_

5. 🙋 Edit `<repo root>/.github/CODEOWNERS` and add your team as owners to the
   existing paths there. Or add `/** @<github user or team>` if there is going
   to be only one owner.

6. 📚 Move `<repo root>/README.md` to
   `<repo root>/docs/breakproof-repo-base.README.md` (or similar) & create your
   own `<repo root>/README.md`. You move or copy the
   `<repo root>/docs/after-fork-setup/README.md` as your main one.

7. [Generate new](./docs/pnpm-intro.md#creating-a-new-package-in-the-repo) or
   [import your existing](./infra/devx-and-repo/repo-shell-scripts/README.md#using-import-from-other-repo)
   projects.

## If you want to automatically release projects as `npm` packages

You need to add some GitHub configuration for your repository:

1. Create a
   [`bot`/ `machine` GitHub account](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#3-account-requirements)
   that will be used **_ONLY_** for the automatic release process. Using email
   like `bot@<your domain>.com`.

2. Set up GitHub repository `variable`s:

   - `AUTORELEASE_BOT_NAME` – the name to be used as commit author of the
     automatic version changes to your main branch
   - `AUTORELEASE_BOT_EMAIL` – the email associated bot account you've created;
     to be used as commit author of the automatic version changes to your main
     branch

3. Set up GitHub repository `secret`s:

   - `AUTORELEASE_BOT_TOKEN`: a
     [GitHub token with rights to push to repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-tokens-classic)
     to be used by the bot doing automatic releases
   - `NPM_REGISTRY_USER`: your npm registry user
   - _\[Optional\]_ `NPM_REGISTRY_AUTH_TOKEN`: your npm registry auth token, if
     you don't use a password instead
   - _\[Optional\]_ `NPM_REGISTRY_PASSWORD`: your npm registry password if you
     use this instead of auth token

4. Set up GitHub Merge Queue:

   - Head to
     `<your github repo> -> Settings -> Rules -> Rulesets -> New ruleset -> Import a ruleset`
   - And upload `<repo root>/.github/branch-rulesets/Default Branch.json`. This
     will:

     - Require a `Merge Queue` for your default branch.
     - Require `basics` job from the main GitHub workflow to pass before PRs can
       be merged

     The above is used to make sure that no PR is merged while the CI for
     automatic releases of `npm` packages is running. This CI job can push
     version bumps & changelogs to your default branch. Without the merge queue
     there is a risk of a race condition.

5. Write the steps in `<repo root>/.github/actions/npm-login` that will
   authenticate you in the `npm` registry.

   - This action is empty by default and gets called on all places where
     packages are installed
   - To authenticate you would need to configure some repository secrets,
     depending on your auth approach. All the secrets will be accessible as
     environment variables, and not through the GitHub `${{ secrets }}`. This is
     done to overcome a limitation in GitHub reusable actions: they can't
     inherit secrets but do inherit environment variables.
     - `SECRET_NPM_REGISTRY_AUTH_TOKEN` – for this to have a value you must
       create a secret in your repository settings called
       `NPM_REGISTRY_AUTH_TOKEN`
     - `SECRET_NPM_REGISTRY_USER` – for this to have a value you must create a
       secret in your repository settings called `NPM_REGISTRY_USER`
     - `SECRET_NPM_REGISTRY_PASSWORD` – for this to have a value you must create
       a secret in your repository settings called `NPM_REGISTRY_PASSWORD`

6. If you are publishing to a private registry set this at the top of the
   [`<repo root>/.npmrc`](./.npmrc).

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="best-practices-list"></a>

## 🏆 List of Best Practices

|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        badge | details                                                                                                                                                                                                                                                   |
| -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <picture><img src="https://custom-icon-badges.demolab.com/badge/code_generator-E0DDCE?logo=terminal&logoColor=ffffff&labelColor=000000&style=flat-square" valign="middle" style="visibility:visible"/></picture> | **generate** all required **files for a new project** via interactive CLI step-by-step wizard                                                                                                                                                             |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   <picture><img src="https://custom-icon-badges.demolab.com/badge/tests-E0DDCE?logo=check-circle&logoColor=29C82E&labelColor=white&style=flat-square" valign="middle" style="visibility:visible"/></picture> | each new project **comes with unit, e2e** and **integration tests** enabled                                                                                                                                                                               |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   <picture><img src="https://custom-icon-badges.demolab.com/badge/TS_%26_build-E0DDCE?logo=tools&logoColor=white&labelColor=3178c6&style=flat-square" valign="middle" style="visibility:visible"/></picture> | each new project **comes with typescript support** & **build process** enabled                                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <picture><img src="https://custom-icon-badges.demolab.com/badge/fine_tuned_TS-E0DDCE?logo=typescript&logoColor=3178c6&labelColor=white&style=flat-square" valign="middle" style="visibility:visible"/></picture> | the **typescript settings are fine-tuned** based on the type of project you chose in the CLI wizard                                                                                                                                                       |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <picture><img src="https://custom-icon-badges.demolab.com/badge/code_checks-E0DDCE?logo=shield-check&logoColor=29C82E&labelColor=white&style=flat-square" valign="middle" style="visibility:visible"/></picture> | each new project comes with [**_exceptionally extensive_** list of code checks](), individually customizeable for each of your projects                                                                                                                   |
| <picture><img src="https://img.shields.io/badge/autofixes-E0DDCE?labelColor=323330&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRjBEQjRGIiBkPSJtMjI0IDk2IDE2LTMyIDMyLTE2LTMyLTE2LTE2LTMyLTE2IDMyLTMyIDE2IDMyIDE2IDE2IDMyek04MCAxNjBsMjctNTMgNTMtMjctNTMtMjdMODAgMCA1MyA1MyAwIDgwbDUzIDI3IDI3IDUzem0zNTIgMTI4LTI3IDUzLTUzIDI3IDUzIDI3IDI3IDUzIDI3LTUzIDUzLTI3LTUzLTI3LTI3LTUzem03MS0xOTRMNDE4IDlhMzIgMzIgMCAwIDAtNDUgMEw5IDM3M2EzMiAzMiAwIDAgMCAwIDQ1bDg1IDg1YTMyIDMyIDAgMCAwIDQ1IDBsMzY0LTM2NGMxMi0xMiAxMi0zMiAwLTQ1ek0zNTkgMjAzbC01MC01MCA4Ni04NyA1MSA1MS04NyA4NnoiLz48L3N2Zz4%3D" valign="middle" style="visibility:visible"/></picture> | the code checks can **apply possible autofixes** to entire project or only to its files staged for commit                                                                                                                                                 |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <picture><img src="https://custom-icon-badges.demolab.com/badge/autorelease-E0DDCE?logo=rocket&logoColor=red&labelColor=white&style=flat-square" valign="middle" style="visibility:visible"/></picture> | each new project has the ability for **automatic release to `npm` & `GitHub`** when merged in the default branch, following the [conventional commit](`https://www.conventionalcommits.org/en/v1.0.0/)                                                    |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   <picture><img src="https://custom-icon-badges.demolab.com/badge/isolated_env-E0DDCE?logo=grid&logoSource=feather&logoColor=blue&labelColor=white&style=flat-square" valign="middle" style="visibility:visible"/></picture> | each new project has its individual set of **dependencies completely isolated** from the dependencies of the other projects in the repo                                                                                                                   |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <picture><img src="https://custom-icon-badges.demolab.com/badge/individual_nodejs-E0DDCE?logo=nodedotjs&logoColor=323330&labelColor=F0DB4F&style=flat-square" valign="middle" style="visibility:visible"/></picture> | each new **project can choose a different `node.js` version** to use, thus unlock innovation of individual projects                                                                                                                                       |
|                                                                                                                                                                                                   <picture><img src="https://img.shields.io/badge/evergreen-E0DDCE?labelColor=94C796&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBmaWxsPSJncmVlbiIgZD0iTTIzMSAxOTZhOCA4IDAgMCAxLTcgNGgtODh2NDBhOCA4IDAgMCAxLTE2IDB2LTQwSDMyYTggOCAwIDAgMS02LTEzbDQ2LTU5SDQ4YTggOCAwIDAgMS02LTEzbDgwLTEwNGE4IDggMCAwIDEgMTIgMGw4MCAxMDRhOCA4IDAgMCAxLTYgMTNoLTI0bDQ2IDU5YTggOCAwIDAgMSAxIDlaIi8%2BPC9zdmc%2B" valign="middle" style="visibility:visible"/></picture> | all tools that do code checks, tests or release of your project, in fact run in their own **isolated environment with their own `nodejs` version**, which means you can **upgrade them without having to immediately upgrade** your project or vice versa |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <picture><img src="https://custom-icon-badges.demolab.com/badge/github_PR_checks-E0DDCE?logo=github&logoColor=323330&labelColor=white&style=flat-square" valign="middle" style="visibility:visible"/></picture> | **automatically run** some/all of the **code checks & tests on each `GitHub` pull request**, individually customizeable for each of your projects                                                                                                         |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       <picture><img src="https://custom-icon-badges.demolab.com/badge/git_hooks-E0DDCE?logo=git&logoColor=f64d27&labelColor=f0efe7&style=flat-square" valign="middle" style="visibility:visible"/></picture> | **automatically run** some/all of the **code checks & tests before `git` commit**, individually customizeable for each of your projects                                                                                                                   |
|                                                                                                                                                             <picture><img src="https://img.shields.io/badge/optimized_CI-E0DDCE?labelColor=red&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHBhdGggZmlsbD0ieWVsbG93IiBkPSJNMjAuOTggMTEuOGExIDEgMCAwIDAtLjc0LS43N2wtNi44Ni0xLjcyIDIuNTQtNS45MmExIDEgMCAwIDAtLjMyLTEuMTkgMSAxIDAgMCAwLTEuMjMuMDNsLTExIDlhMSAxIDAgMCAwIC4zOSAxLjc0bDYuNzIgMS42OC0zLjM1IDUuODVBMSAxIDAgMCAwIDggMjJhMSAxIDAgMCAwIC42LS4ybDEyLTlhMSAxIDAgMCAwIC4zOC0xeiIvPjwvc3ZnPg%3D%3D" valign="middle" style="visibility:visible"/></picture> | detect which projects have been affected by the pull request changes or pending git commits, and run code checks only for them                                                                                                                            |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <picture><img src="https://custom-icon-badges.demolab.com/badge/show_affected-E0DDCE?logo=megaphone&logoColor=blue&labelColor=gold&style=flat-square" valign="middle" style="visibility:visible"/></picture> | announce what is affected by the **pull requests changes** as a GitHub comment                                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                                       <picture><img src="https://img.shields.io/badge/github_summary-E0DDCE?labelColor=fff&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI%2BCjxwYXRoIGQ9Ik05IDQySDNWOGg2VjZIMXYzOGg4ek00MSA4aDZ2MzRoLTZ2Mmg4VjZoLTh6Ii8%2BCjxwYXRoIGQ9Ik03IDE2aDM2djJIN3ptMCA4aDMydjJIN3ptMCA4aDM2djJIN3oiLz4KPC9zdmc%2B" valign="middle" style="visibility:visible"/></picture> | add **meaningful summary of your GitHub workflows** with the contextual info of what they are running (_GitHub workflow markdown summary_)                                                                                                                |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <picture><img src="https://custom-icon-badges.demolab.com/badge/simple_codemods-E0DDCE?logo=terminal&logoColor=ffffff&labelColor=000000&style=flat-square" valign="middle" style="visibility:visible"/></picture> | ability to **modify existing projects**, so you can make them release-able or add code-checks, all done **via a CLI step-by-step wizard**                                                                                                                 |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <picture><img src="https://custom-icon-badges.demolab.com/badge/reusable_scripts-E0DDCE?logo=sync&logoColor=54B33E&labelColor=131314&style=flat-square" valign="middle" style="visibility:visible"/></picture> | **shared `npm` scripts** listed in a single place and can be **used by any of your packages** to help you analyze problems with it                                                                                                                        |
|                                                                                                                                                                                                                                   <picture><img src="https://img.shields.io/badge/conventions-E0DDCE?labelColor=87CEEB&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI%2BPHBhdGggZmlsbD0iYmx1ZSIgZD0iTTY0IDI1YzAgMS0xIDMtMyAzSDNjLTIgMC0zLTItMy0zVjE0YzAtMiAxLTMgMy0zaDU4YzIgMCAzIDEgMyAzdjExem0wIDI1YzAgMi0xIDMtMyAzSDNjLTIgMC0zLTEtMy0zVjM5YzAtMSAxLTMgMy0zaDU4YzIgMCAzIDIgMyAzdjExeiIvPjwvc3ZnPg%3D%3D" valign="middle" style="visibility:visible"/></picture> | conventions to be followed by each package for more **unified development experience**                                                                                                                                                                    |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <picture><img src="https://custom-icon-badges.demolab.com/badge/editor_DX-E0DDCE?logo=file-code&logoColor=59c66c&labelColor=252725&style=flat-square" valign="middle" style="visibility:visible"/></picture> | **instructions** and importable configuration **for your code editor** to get the best developer experience possible when developing your projects                                                                                                        |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <picture><img src="https://custom-icon-badges.demolab.com/badge/repo_config-E0DDCE?logo=settings&logoSource=feather&logoColor=454c54&labelColor=f0f2f5&style=flat-square" valign="middle" style="visibility:visible"/></picture> | **instructions** on how to **configure your GitHub repository** to prevent problems and work best with the breakproof base                                                                                                                                |

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="how-it-works"></a>

# ⚙️ How the repo works

**What you see is what you get**:

- Installation of industry-standard tools
- Base configs of those tools, which are created to work well together
- Code-generation tool that creates your new project with ~empty config files
  that extend the base ones.
- Your projects can directly add/override specific config parts or optionally
  use available helpers to do so
- Since your project simply extends the config, you can modify it to fit your
  package individual needs without learning new config formats specific to this
  repo – _**you directly use the configs of each tool**_.
- Each tool runs in isolated environment with its individual version of `nodejs`
  (_[see ❓ How can tools use different node.js ❓](#but-how-multiple-nodejs)_)

<a name="tools-list"></a>

## 🧰 The current list of tools configured to work together

Nothing is perfect, so this list will inevitably change
(_[see ⬇️ "What's next?"](#whats-next)_). Here are the currently used tools:

| Tool                                                                                                                                               | What it's used for                                                       | Provided Configuration                                                              | `node.js` version used                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------- |
| [🌐](https://pnpm.io/) `pnpm`                                                                                                                      | [🧩 multiple roles](./docs/tools-details.md#pnpm-role)                   | [⚙️ forkable config in repo](./docs/tools-details.md#pnpm-config)                   | n/a _(does not rely on available `node.js`)_ |
| [🌐](https://www.gnu.org/software/bash/) `bash` functions & scripts                                                                                | [🧩 multiple roles](./docs/tools-details.md#bash-role)                   | 🕳️ no config applied in repo                                                        | n/a _(does not rely on `node.js`)_           |
| [🌐](https://www.shellcheck.net/) `shell-check`                                                                                                    | [🧩 multiple roles](./docs/tools-details.md#shell-check-role)            | 🕳️ no config applied in repo                                                        | n/a _(does not rely on `node.js`)_           |
| [🌐](https://eslint.org/) `eslint` + plugins                                                                                                       | [🧩 multiple roles](./docs/tools-details.md#eslint-role)                 | [⚙️ base config in repo](./docs/tools-details.md#eslint-config)                     | `v22.6.0`                                    |
| [🌐](https://prettier.io/) `prettier`                                                                                                              | [🧩 multiple roles](./docs/tools-details.md#prettier-role)               | [⚙️ base config in repo](./docs/tools-details.md#prettier-config)                   | `v22.6.0`                                    |
| [🌐](https://www.typescriptlang.org/) `typescript`                                                                                                 | [🧩 multiple roles](./docs/tools-details.md#typescript-role)             | [⚙️ base config in repo](./docs/tools-details.md#typescript-config)                 | `<same as your package>` or `v22.6.0`        |
| [🌐](https://sucrase.io/) `sucrase`, [🌐](https://typestrong.org/ts-node/) `ts-node` & [🌐](https://github.com/privatenumber/tsx) `tsx`            | [🧩 multiple roles](./docs/tools-details.md#sucrase-tsnode-tsx-role)     | [⚙️ base config in repo](./docs/tools-details.md#sucrase-tsnode-tsx-config)         | `<same as your package>` or `v22.6.0`        |
| [🌐](https://rhysd.github.io/actionlint/) `actionlint`                                                                                             | [🧩 multiple roles](./docs/tools-details.md#actionlint-role)             | 🕳️ no config applied in repo                                                        | n/a _(does not rely on `node.js`)_           |
| [🌐](https://github.com/lint-staged/lint-staged) `lint-staged`                                                                                     | [🧩 multiple roles](./docs/tools-details.md#lint-staged-role)            | [⚙️ base config in repo](./docs/tools-details.md#lint-staged-config)                | `v22.6.0`                                    |
| [🌐](https://github.com/acrazing/dpdm#readme) `dpdm`                                                                                               | [🧩 multiple roles](./docs/tools-details.md#dpdm-role)                   | [⚙️ base config in repo](./docs/tools-details.md#dpdm-config)                       | `v22.6.0`                                    |
| [🌐](https://github.com/depcheck/depcheck#readme) `depcheck`                                                                                       | [🧩 multiple roles](./docs/tools-details.md#depcheck-role)               | [⚙️ base config in repo](./docs/tools-details.md#depcheck-config)                   | `v22.6.0`                                    |
| [🌐](https://github.com/runem/lit-analyzer#readme) `lit-analyzer`                                                                                  | [🧩 multiple roles](./docs/tools-details.md#lit-analyzer-role)           | [⚙️ base config in repo](./docs/tools-details.md#lit-analyzer-config)               | `v22.6.0`                                    |
| [🌐](https://jamiemason.github.io/syncpack/) `syncpack`                                                                                            | [🧩 multiple roles](./docs/tools-details.md#syncpack-role)               | [⚙️ forkable config in repo](./docs/tools-details.md#syncpack-config)               | `v22.6.0`                                    |
| [🌐](https://www.cypress.io/) `cypress`                                                                                                            | [🧩 multiple roles](./docs/tools-details.md#cypress-role)                | [⚙️ base config in repo](./docs/tools-details.md#cypress-config)                    | `v22.6.0`                                    |
| [🌐](https://jestjs.io/) `jest`                                                                                                                    | [🧩 multiple roles](./docs/tools-details.md#jest-role)                   | [⚙️ base config in repo](./docs/tools-details.md#jest-config)                       | `v22.6.0`                                    |
| [🌐](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog#readme) `conventional-changelog` | [🧩 multiple roles](./docs/tools-details.md#conventional-changelog-role) | [⚙️ base config in repo](./docs/tools-details.md#conventional-changelog-config)     | `v22.6.0`                                    |
| [🌐](https://github.com/release-it/release-it?tab=readme-ov-file#release-it-) `release-it`                                                         | [🧩 multiple roles](./docs/tools-details.md#release-it-role)             | [⚙️ base config in repo](./docs/tools-details.md#release-it-config)                 | `v22.6.0`                                    |
| [🌐](https://webpack.js.org/) `webpack`                                                                                                            | [🧩 multiple roles](./docs/tools-details.md#webpack-role)                | [⚙️ base config in repo](./docs/tools-details.md#webpack-config)                    | `<same as your package>` or `v22.6.0`        |
| [🌐](https://rollupjs.org/) `rollup` + plugins                                                                                                     | [🧩 multiple roles](./docs/tools-details.md#rollup-role)                 | [⚙️ base config in repo](./docs/tools-details.md#rollup-config)                     | `<same as your package>` or `v22.6.0`        |
| [🌐](https://babel.dev/) `babel` + plugins                                                                                                         | [🧩 multiple roles](./docs/tools-details.md#babel-role)                  | [⚙️ base config in repo](./docs/tools-details.md#babel-config)                      | `<same as your package>` or `v22.6.0`        |
| [🌐](https://www.hygen.io/) `hygen`                                                                                                                | [🧩 multiple roles](./docs/tools-details.md#hygen-role)                  | [⚙️ forkable config in repo](./docs/tools-details.md#hygen-config)                  | `v22.6.0`                                    |
| [🌐](https://git-scm.com/) `git` hooks                                                                                                             | [🧩 multiple roles](./docs/tools-details.md#git-hooks-role)              | [⚙️ forkable config in repo](./docs/tools-details.md#git-hooks-config)              | n/a _(does not rely on `node.js`)_           |
| [🌐](https://github.com/features/actions) `github` CI                                                                                              | [🧩 multiple roles](./docs/tools-details.md#github-ci-role)              | [⚙️ forkable config in repo](./docs/tools-details.md#github-ci-config)              | n/a _(does not rely on `node.js`)_           |
| [🌐](https://code.visualstudio.com/) `VSCode` calibration                                                                                          | [🧩 multiple roles](./docs/tools-details.md#vscode-calibration-role)     | [⚙️ hint + importable config](./docs/tools-details.md#vscode-calibration-config)    | `v22.6.0` (_editor itself uses that_)        |
| [🌐](https://www.jetbrains.com/) `JetBrains` calibration                                                                                           | [🧩 multiple roles](./docs/tools-details.md#jetbrains-calibration-role)  | [⚙️ hint + importable config](./docs/tools-details.md#jetbrains-calibration-config) | `v22.6.0` (_editor itself uses that_)        |

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="but-how-multiple-nodejs"></a>

## ❓ How can tools use different node.js? ❓

1. 💡 **There's no magic!** `The Breakproof Repo` takes advantage of the 2
   simple ideas:

   1. in a monorepo, everything can be an individual package
   2. industry-standard tools like `pnpm` can define package-specific behaviour

2. 📦 So in a monorepo, **each of your projects are individual packages**. In
   the same way, it's possible to create a package inside the repository that
   **only installs 1 tool and nothing else**.

3. ↪️ Instead of installing the tools directly, your projects install the other
   packages from the repo that isolate the tool they need inside of them. **In
   other words**:

   - If you need `eslint`, instead of running `pnpm install eslint --save-dev`,
     your project will do `pnpm install @repo/eslint-base-isolated --save-dev`
   - And instead of running `npx eslint`, your project will do
     `pnpm --filter="@repo/eslint-base-isolated" run eslint` which means they
     run the `eslint` script defined in the `package.json` of the
     `<tool name>-base-isolated` package
   - The existence of `@repo/eslint-base-isolated` as individual package allow
     us to define that all of its scripts (_including the `eslint`_ one) are
     executed using a specific version of node. For this to happen we currently
     rely on `pnpm`
     (_[the roles of pnpm in this repo are listed below ⬇️](#pnpm-role)_)
   - Finally, the `eslint` script simply needs to enter your project directory
     (a.k.a. `cd <project dir>`) and run `eslint`.

**Related:**

- In reality, it's very unlikely that you ever run
  `pnpm --filter="@repo/evergreen-eslint-isolator" run eslint` yourself, because
  the base configuration files and code generators in this repo already know
  about the packages that isolate tools and use them.
- The name of the package `@repo/evergreen-eslint-isolator` is an example, so
  practically it can be called anything

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="conventions-and-core-principles"></a>

# ⚖️ Repository conventions & core principles

- Avoid adding abstractions to the already overloaded frontend world
- People should be aware of what comes with their dependencies
- Each package must declare the `node.js` version used for running the `scripts`
  its `package.json`
  - mandatory eslint code check for this runs on git precommit & GitHub PR
- Packages are allowed to pick `node.js` version from a white-list to avoid
  extreme fragmentation of versions
  - mandatory eslint code check for this runs on git precommit & GitHub PR
- Each package must have a script called `lint:precommit` which would run as git
  hook before commits and execute preferred code checks
  - mandatory eslint code check for this runs on git precommit
- Each package must have a script called `lint:github-pr` which would run on
  each push to a GitHub PR and execute preferred code checks
  - mandatory eslint code check for this runs on GitHub PR
- Each package that requires a build step must have scripts called `build` and
  `dev` which are used to verify build passes and run before building other
  packages that depend on them
  - If the package is an app, the `dev` script can also be named `serve` to
    match popular conventions
- Each package that should be published to `npm` registry must have s script
  called `release` and whatever is executed must accept arguments compatible
  with `release-it` CLI
- Following what each configuration extends and understanding why it's
  configured this way should be easy
- Writing configurations files should provide hints for available options
  without having to jump to documentation every time
  - Prefer `.ts` config over `.js`, `.cjs`, `.mjs` or `.json` config. We get
    type checks + ability to comment.
  - Prefer `.mjs` config with jsdoc over `.js`, `.cjs`, or `.json` config. We
    get type hints + ability to comment.
  - Prefer `.cjs` or `.js` config with jsdoc over `.json` config. We get type
    hints + ability to comment.
- Configurations can have different variations (e.g. "dev" vs "production" mode)
  and preferably they are defined in a single file without repeating different
  options for each mode
- When using `CLI` commands prefer `--longer` argument names over shorter
  versions like `-l`
- Code editors are first-class runtime environments we need to care about
  - postinstall script that guarantees code editors see `eslint` and `prettier`
    but CI doesn't do this extra step
- Build-caching should be thought as a separate layer that can be added later,
  not requirement from the start

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

<a name="whats-next"></a>

# 📋️ What's next?

The
[GitHub issues of type `Feature`](https://github.com/YotpoLtd/breakproof-base-monorepo/issues?q=is%3Aissue%20state%3Aopen%20type%3AFeature)
can give you a picture of what kind of improvements we've been looking into.

Since the repository is done in a way that allows tools to be swapped there are
some ideas, that we haven't yet created issues for. For example:

- `eslint` might in the future be swapped out with another tool like `oxc`
  linter or perhaps whatever void0 are working on.
- `rollup` might in the future be swapped out with `rolldown`
- `webpack` is a build tool that served the FE community well. People can see it
  as "old" or "outdated", but it keeps on living, used by `next.js` or reborn as
  `rspack`, or `turpopack`. Currently, the sandbox applications in the
  breakproof repo use `webpack`, but that could be swapped for any other build
  tool
- so far `lint-staged` has served us well, but we might just replace it with a
  simple `.ts` script, since we are starting to tweak more from it, and we
  actually only use its config format and its ability to list staged files and
  then show their execution + some meta sugar in the terminal.
- `cypress` + Cypress Cloud can be a great combo which has been a good friend in
  end-to-end and integration testing. But for a while we can see developers can
  are drawn to the more native way of writing tests with `playwright`.
- ... _check out the
  [GitHub issues](https://github.com/YotpoLtd/breakproof-base-monorepo/issues)
  or create one if you have an idea_.

<p> </p>

[⬆️ Back to top nav ⬆️](#breakproof-nav)

<p> </p>

# Breakproof repo specifics

- conventional changelog allows a lot of prefixes, the repo only respects `fix`,
  `feat` and breaking changes.

## Yotpo specifics

There are 2 packages providing base config for `eslint` and `prettier`. One
(`@repo/eslint-base-isolated`) which depends on the other
(`@yotpo-common/shared-linter-config`).

We've done this because internally some projects in yotpo still live in their
own separate repos. `@yotpo-common/shared-linter-config` is used to share the
configuration with projects outside our breakproof repo, while
`@repo/eslint-base-isolated` extends it with some tweaks.

# Breakproof repo fixes

1. For better integration with JetBrains IDEs, there is a _"fake"_
   `<repo root>/package.json`. It's intentionally a symlink to a non-existent
   path

2. To work around a limitation in `pnpm` filtering, we introduce a new section
   of dependencies in `package.json` called `devtoolsDependencies`. It's
   intended for packages that do not affect the runtime or the build. So things
   like lint, tests, or local development helpers.

3. In order to be strict and avoid packages accessing `<repo root>/node_modules`
   but still let code-editors find installations of tools (_e.g._ `prettier`) we
   introduced `codeEditorDependencies` in root `package.json5` that installs a
   few dependencies only for local development (**_NOT_** _in CI_) and **_DOES
   NOT SAVE_** them to the lock file.

4. The preinstall script:

   ```shell
   [ -n \"$(pwd | grep '/node_modules/')\" ] || echo $npm_config_user_agent | grep -q 'pnpm/' || (echo 'PLEASE USE PNPM, not NPM' && exit 1)
   ```

   We want to disallow package managers other than `pnpm` to be accidentally
   used in this repo. So we add this script to every package `preinstall` hook.

   Ideally it would be just `npx only-allow pnpm` as described in
   [pnpm docs](https://pnpm.io/only-allow-pnpm), but:

   1. [There is a bug](https://github.com/pnpm/only-allow/pull/14) in
      `only-allow` so we work around it.
   2. If developer is only using `pnpm` they might not have `node` installed at
      all, so we need to check if `npx` exists (_via `which npx`_)
