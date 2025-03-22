import { Config } from 'lint-staged';

const config: Config = {
  '!(*{.js,.cjs,.mjs,.ts,.jsx,.tsx,CHANGELOG.md,package-lock.json,pnpm-lock.yaml})':
    ['prettier --ignore-unknown --check'],
  '*.{js,cjs,mjs,ts,jsx,tsx}': [
    'eslint --no-eslintrc --config=.eslintrc-precommit.cjs',
  ],
};

/**
 * This is a weird export syntax makes it possible other files
 * to import from this one using either `require()` and `import .. from`
 */
export = config;
