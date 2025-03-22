To make all automatic magic work we need to write commit messages in same format.

The breakproof repo adopts the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) concept which helps
with it.

## Commits format

Each commit may trigger

- patch bump (0.0.1 => 0.0.2)
- minor bump (0.0.1 => 0.1.0)
- major bump (0.0.1 => 1.0.0)
- no release

If there are few commits, the biggest bump would be applied.

So if you have 3 commits, one is for patch, second one is for minor and third not triggering a release, **minor**
release would be made.

> [!IMPORTANT]
>
> When you do a commit, put type wisely, it would define which version would be released. It's _very_ important to
> follow semver convention to let users of your library update it and not be surprised

### Would trigger patch release

- `commit without type` (_install linter to prevent such commits or ask your repo maintainer to do that_)
- `fix: some information`
- `fix(ui-components): some information`

### Would trigger minor release

- `feat: some information`
- `feat(angular-b2b-components): some information`

### Would trigger major release

```
fix: some information

BREAKING CHANGE: api of a dropdown changed
```

```
feat(ui-components): some information

BREAKING CHANGE: api of a dropdown changed
```

To create such commit from CLI use `git commit -m "fix: something" -m "BREAKING CHANGE: api changed"`

### Would NOT trigger a release

Commit types other than the mentioned above **will NOT trigger a release**.

So if you do any of:

- `build: ...`
- `ci: ...`
- `docs: some information... `
- `test(ui): add tests ...`
- `style: ...`
- `refactor: ...`
- `add: ...`
- `improvement: ...`
- ... anything else

then automatic release process will not happen.

## Changelog

Each commit(except ones with ignored types) would be converted into one line in changelog.

If there is a `BREAKING CHANGES` commit, additional block would be added

Commits with type which does not trigger a release (`build, ci, docs, style, refactor, test`) would not be included into
the changelog

Example:

```git
feat(header): added lgout button
fix(footer): fixed disabled button
fix: removed glitch
   BREAKING CHANGES: removed "color" input from footer component
ci: optimized build
```

Would generate a changelog of a format

```

### Bug Fixes

* footer: fixed disabled button
* removed glitch

### Features

* footer: added lgout button

### BREAKING CHANGES

* removed "color" input from footer component

```
