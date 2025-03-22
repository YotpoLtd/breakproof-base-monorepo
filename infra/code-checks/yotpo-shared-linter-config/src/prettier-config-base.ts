import { Config } from 'prettier';

const config: Config = {
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  printWidth: 80,
  proseWrap: 'always',
  singleQuote: true,
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'consistent',
      },
    },
  ],
};

/**
 * This is a weird export syntax makes it possible other files
 * to import from this one using either `require()` and `import .. from`
 */
export = config;
