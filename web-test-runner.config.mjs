// eslint-disable-next-line import/no-extraneous-dependencies
import { playwrightLauncher } from '@web/test-runner-playwright';

const packagesToTest = [
  'dedupe-mixin',
  'lit-helpers',
  'scoped-elements',
  'semantic-dom-diff',
  'testing',
  'testing-helpers',
].join('|');

export default {
  files: `packages/(${packagesToTest})/**/*.test.(js|html)`,
  nodeResolve: true,
  concurrency: 10,
  // browsers: [
  //   playwrightLauncher({ product: 'firefox', concurrency: 1 }),
  //   playwrightLauncher({ product: 'chromium' }),
  //   playwrightLauncher({ product: 'webkit' }),
  // ],
  coverage: true, 
  coverageConfig: {
    exclude: [
      'packages/testing/import-wrappers/**/*'
    ],
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 80,
      branches: 60,
      functions: 70,
      lines: 80,
    }
  },
};
