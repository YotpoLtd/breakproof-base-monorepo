## Yotpo Conventional Preset based on [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-angular/README.md).

# Difference from conventional-changelog-angular

This packages does exactly the same job, except:

1. It would only respect commits with types `feat`, `fix`, `perf` when
   calculating recommended bump. And commits without type as a `patch` update.

## To do

1. Change CHANGELOG generating template so it would render changes without a
   type in a separate block
