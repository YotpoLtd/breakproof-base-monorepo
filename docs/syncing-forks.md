# How to sync your fork

Updating a fork with improvements from `breakproof-base-monorepo` happens by:

1. Adding `breakproof-base-monorepo` as a remote to your fork. Typically, these kinds of remotes are called `upstream`
2. Creating a new branch where you run `git pull upstream master`
3. Creating a PR from that new branch

## Caveats

- if packages in `breakproof-base-monorepo` were renamed, then the lint checks on your PR should fail and show that
  - in rare cases some lint checks might not cover all renaming, if something unexpected happens please report it
- your fork had a long running feature branch that was generated a while ago
  - in this case you might have updated your main branch
