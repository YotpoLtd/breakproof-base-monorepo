> _this file is intentionally called `_README.md` because otherwise GitHub will
> show this as the main repository README_

# GitHub Workflows

CI & CD for the projects in this repo

# Core ideas & limitations

## For the workflows that come with this base repo

1. **Prefer combining a few related workflows into 1.** We want minimum number
   of built-in workflow files, because GitHub allows workflow files to be
   defined only under `.github/workflwos` and not recursively
2. We need Merge Queue + workflow checks for each PR that will wait for workflow
   running on the repository default branch
   - That's because the automatic release that runs on the repository default
     branch will need to commit & push to it. If PRs are allowed to be merged
     without waiting, that will create a race condition of PR merge VS
     autorelease push, and one will fail
3. In the Merge Queue we can allow only a single PR at a time to be checked due
   to the
   [non-intuitive GitHub behaviour of cancelling jobs even if `cancel-in-progress: false` is set](https://github.com/orgs/community/discussions/12835).
