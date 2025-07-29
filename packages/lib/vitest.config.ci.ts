import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'test/**/*',
        'vitest.config.ci.ts',
      ],
      reportsDirectory: 'coverage',
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: 'coverage/vitest-junit.xml',
    },
  },
});
