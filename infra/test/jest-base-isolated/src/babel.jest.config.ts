import {
  BabelConfigGeneratorOptions,
  getBabelConfig,
} from '@repo/babel-base-isolated';
import { NodeEnv, RuntimeEnv } from '@repo/environment';

export const getBabelJestConfig = (
  options?: Partial<BabelConfigGeneratorOptions>,
) =>
  getBabelConfig({
    mode: NodeEnv.TEST,
    runtimeTarget: RuntimeEnv.NODE,
    ...options,
  });

export default getBabelJestConfig();
