import { defineConfig } from 'cypress';

type Config = Parameters<typeof defineConfig>[0];

export default {
  e2e: {
    baseUrl: 'http://localhost:8080',
    downloadsFolder: '__e2e_artifacts__/downloads',
    screenshotsFolder: '__e2e_artifacts__/videos',
    videosFolder: '__e2e_artifacts__/videos',
    setupNodeEvents() {
      // Implement node event listeners here
    },
    specPattern: ['src/**/*.e2e.{js,jsx,ts,tsx}'],
    supportFile: './cypress.e2e.setup.ts',
  },
} satisfies Config;
