import { getBabelConfig } from '@repo/babel-base-isolated';
import { NodeEnv, RuntimeEnv } from '@repo/environment';

export default getBabelConfig({
  mode: NodeEnv.TEST,
  runtimeTarget: RuntimeEnv.NODE,
});
