# `@repo/shell-scripts`

This package does 3 jobs:

- provides bash scripts that are used in CI & in git hooks as shortcuts to
  common `pnpm` commands
- defines what is changes are considered "_related to build_", "_related to
  test_" or unrelated to both
- provides a bash script to import another repo (_or subdir of it_) into this
  repo by maintaining the relevant git history. The script is then exposed as
  `repo:import-from-other-repo` in the
  [repo-root `package.json5`](../../../package.json5).

All `bash` scripts are checked via `shellcheck`. Importing of other repo/repo
subdir is utilizing `git-filter-repo` which requires `python3`.

You can find
[info about `bash` and `shell-check` in the documentation](../../../docs/tools-details.md)
about the role, config & alternatives of each tool.

<a name="using-import-from-other-repo"></a>

### Using `repo:import-from-other-repo`

> [!WARNING]
>
> The script uses `python3` internally, if you see some python-related errors
> during this script execution, they might be due to using virtual python
> envrionments.
>
> In this case, try using the `python3` directly installed via homebrew instead
> of pyenv, pipenv or virtualenv

1. Create a ticket in your tracking system for the import of your projects
   (_apps, libs, widgets, etc._).

2. You need to merge all of your open PRs and active branches in your original
   repository to `master`.

3. Once you have them in `master`, you need to check this new repo out locally
   (`git clone`) and run `pnpm --filter=devtools... install` inside of it
   - 💡️If you've cloned this repo and then forgot about it for a while, make
     sure you do `git pull`
4. You can move each of your projects into this new repo by running an
   ✨️*automated script* ✨️
   `pnpm --workspace-root run repo:import-from-other-repo`. To run this script
   you need to enter the new repo directory, a.k.a.
   `cd ./<your name>-frontend-monorepo`
   1. Simply running `pnpm --workspace-root run repo:import-from-other-repo`
      won't do anything, it will output help information
   2. You need to provide some input. **Before doing that, make sure you are
      currently on branch `master`**.
5. When the script finishes the migration, it creates & checks out a new branch
   `<TASK-ID>-import-<original repo name>` in which you have all the project
   code from your original repo, with all git history preserved.
6. At this point, the script will start asking you questions about the imported
   project and try its best in guiding you to align your project with the
   repository conventions
7. In the end, please regenerate the `pnpm` lock file by running
   `pnpm --filter='*' install`. Don't do any other changes in this branch.
