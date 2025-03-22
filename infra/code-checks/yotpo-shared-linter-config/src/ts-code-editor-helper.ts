import { EslintConfig } from './types';

/**
 * Passing the explicit path to the directory where the tsconfig file(s) are located
 * is required in order to integrate with some code editors like VSCode.
 *
 * This is a helper method to make overriding this path easier.
 */
export const getCodeEditorTypescriptEslintConfig = (
  tsconfigRootDir: string,
): EslintConfig => [
  {
    files: ['**/*.{ts,tsx,mts}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig*(.*).json',
        tsconfigRootDir,
        warnOnUnsupportedTypeScriptVersion: false,
      },
      // not every year / version is present:
      // https://github.com/eslint/eslint/issues/15580#issuecomment-1030878719
      ecmaVersion: 2018,
      sourceType: 'module',
    },
  },
];
