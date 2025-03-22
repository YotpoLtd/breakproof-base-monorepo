This package does one simple thing:

It lets other Angular based packages run `jest` tests using this package's
specific `node.js` version. It works by providing a script in its `package.json`
that other packages can call to run their tests.

## Extras

- The Angular package doesn't need to provide `jest` config file, the
  `jest.config.mjs` from this package is used
- The Angular packages can provide `jest` setup file by creating a
  `jest.setup.ts` but they can also skip it, which will default to the
  `jest.setup.ts` in this package
