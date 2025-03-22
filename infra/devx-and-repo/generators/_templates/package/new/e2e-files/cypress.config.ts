import { defineConfig } from 'cypress';

import baseCypressConfig from '@repo/cypress-base-isolated/cypress.config.base';

export default defineConfig({ ...baseCypressConfig, projectId: 'your-project-id' });
