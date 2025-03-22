---
to: "<%- supportingForProject ? null : `${h.getDestinationByType({ type, subtype, name })}/jest.setup.ts`%>"
---
import '@repo/jest-base-isolated/jest.setup.base';