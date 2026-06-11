import { defineConfig } from 'vitest/config';

/**
 * Root test runner config: one vitest install, one `npm test`, with each
 * workspace that has tests registered as a project. Node environment only —
 * the suites cover pure/critical backend + shared logic (no jsdom/component
 * tests yet). Test files live next to the modules they cover (src/**\/*.test.ts).
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'shared',
          root: './packages/shared',
          environment: 'node',
        },
      },
      {
        test: {
          name: 'server',
          root: './apps/server',
          environment: 'node',
        },
      },
    ],
  },
});
