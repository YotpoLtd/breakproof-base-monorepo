# `@repo/code-problem-snapshotter`

Exposes reusable function that is intended to be used by CLI packages that want
to:

- collect incoming STDIN input as one string
- parse that string into a list of code problems per file
- then choose what to do with this list:
  - save as snapshot
  - compare with previously created snapshot and fail if there is increase in
    the code problems
  - if there is an increase we also want print which code problems for which
    file have increased
