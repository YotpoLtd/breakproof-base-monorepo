---
to: "<%- supportingForProject ? null : `${h.getDestinationByType({ type, subtype, name })}/src/example.spec.ts` %>"
---
import { expect, test } from '@jest/globals';

test('example unit test', () => {
	expect(3).toBe(3);
});
