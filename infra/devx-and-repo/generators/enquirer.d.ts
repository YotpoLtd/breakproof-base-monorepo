/**
 * Override the terrible type definitions of `enquirer` in order
 * to get its better UX over inquirer.
 *
 * These are only partial type definitions of the things we use.
 * They don't represent the entire API of `enquirer`
 */
declare module 'enquirer' {
  type ErrorMessage = string;

  export interface PromptChoice<T> {
    title?: string;
    message?: string;
    value: T;
  }

  export interface BasePromptOptions<T> {
    message: string;
    prefix?: string | { pending: string; submitted: string };
    hint?: string;
    result?: (value: T) => T;
    validate?: (value: T) => true | ErrorMessage;
  }

  export interface InputPromptOptions<T> extends BasePromptOptions<T> {
    initial?: T;
  }

  export interface AutocompletePromptOptions<T> extends BasePromptOptions<T> {
    choices: Array<PromptChoice<T> | T>;
  }

  export interface TogglePromptOptions extends BasePromptOptions<boolean> {
    enabled: string;
    disabled: string;
    initial?: boolean;
  }

  export interface ChoicePromptOptions<T> extends BasePromptOptions<T> {
    choices: Array<PromptChoice<T> | T | string>;
    initial?: T;
  }

  export interface MultiChoicePromptOptions<T> extends BasePromptOptions<T> {
    choices: Array<PromptChoice<T> | T>;
    initial: Array<T>;
  }

  export interface QuizPromptOptions<T> extends BasePromptOptions<T> {
    choices: Array<string> | Readonly<Array<string>>;
    correctChoice: number;
    initial?: number;
  }

  export interface Prompts {
    autocomplete<T>(options: AutocompletePromptOptions<T>): Promise<T>;
    input<T = string>(options: InputPromptOptions<T>): Promise<T>;
    toggle(options: TogglePromptOptions): Promise<boolean>;
    select<T>(options: ChoicePromptOptions<T>): Promise<T>;
    multiselect<T>(options: MultiChoicePromptOptions<T>): Promise<Array<T>>;
    quiz<T>(options: QuizPromptOptions<T>): Promise<{
      selectedAnswer: string;
      correctAnswer: string;
      correct: boolean;
    }>;
  }

  const prompts: Prompts;
  export default prompts;
}
