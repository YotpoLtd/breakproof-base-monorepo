## Manual code editor integration

Below you can find 2 sections detailing instructions for `JetBrains`-based IDEs
and `VSCode`-based editors.

The general idea for any editor/IDE is to:

- support or have plugin/extension for `eslint`
- support or have plugin/extension for `prettier`
- support or have plugin/extension for `TypeScript`
- configure specific versions of nodejs, prettier, eslint and typescript to be
  used by your editor
- `[nice to have]` support or have plugin/extension for GitHub CODEOWNERS file
- `[nice to have]` support or have plugin/extension for GitHub `.json5`

### Settings for the best developer experience

#### JetBrains-based IDEs

- Modifying `<repo root>/.idea/workspace.xml`:
  1. Open up `<repo root>/.idea/workspace.xml` and find where the `keyToString`
     section is (_look like json, but it could also be using `&quot;` instead of
     normal `"`_).
  2. Open up
     [`<repo root>/.idea/workspace.recommended-keyToString.json5`](../.idea/workspace.recommended-keyToString.json5)
     and read the comment at the top
  3. Copy settings from there to `<repo root>/.idea/workspace.xml`
  4. Adjust the values noted in the top comment & remove all comments
  5. Open up
     [`<repo root>/.idea/workspace.recommended-VcsManagerConfiguration.xml`](../.idea/workspace.recommended-VcsManagerConfiguration.xml)
     copy its contents as children to
     `<component name="VcsManagerConfiguration">` element in
     `<repo root>/.idea/workspace.xml`
- Overwrite/create `<repo root>/.idea/prettier.xml` with
  [`<repo root>/.idea/prettier.recommended.xml`](../.idea/prettier.recommended.xml)
- Overwrite/create `<repo root>/.idea/jsLinters/eslint.xml` with
  [`<repo root>/.idea/eslint.recommended.xml`](../.idea/eslint.recommended.xml)
  (_please note the final file path is within `jsLinters` sub-directory_)
- Overwrite/create `<repo root>/.idea/jsLibraryMappings.xml` with
  [`<repo root>/.idea/jsLibraryMappings.recommended.xml`](../.idea/jsLibraryMappings.recommended.xml)
- Double-check your editor is using
  [the TypeScript you need (_see the section about TypeScript specifics below_)](../README.md#typescript-specifics)
- Restart your IDE

#### VSCode-based editors (VSCode, VSCodium, Cursor, etc.)

1. Open/Create your workspace settings file `.vscode/settings.json`
2. Open
   [`<repo root>/.vscode/settings.recommended.json5`](../.vscode/settings.recommended.json5)
   and read the comment at the top
3. Copy settings from there to `.vscode/settings.json`
4. Adjust the values noted in the top comment
5. Double-check your editor is using
   [the TypeScript you need (_see the section about TypeScript specifics below_)](../README.md#typescript-specifics)
6. Restart your editor
