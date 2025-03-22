/**
 * This file is imported & transpiled by `release-it`
 */
// eslint-disable-next-line simple-import-sort/imports -- We need tsx import first
import 'tsx/cjs';

import { getPackageAbsoluteDir } from '@repo/circular-dependency-workaround';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires -- because of the circular dependency workaround
const baseConfig = require(
  `${getPackageAbsoluteDir('@repo/release-it-base-isolated')}/lib/release-it.base.js`,
).default;

export default { ...baseConfig };
