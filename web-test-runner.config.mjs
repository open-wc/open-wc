import fs from 'fs';
import { playwrightLauncher } from '@web/test-runner-playwright';

const packages = fs
  .readdirSync('packages')
  .filter(
    dir =>
      fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test-web`),
  );

export default {
  files: `packages/*/test-web/*.test.(js|html)`,
  nodeResolve: true,
  concurrency: 10,
  browsers: [
    // playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'chromium' }),
    // playwrightLauncher({ product: 'webkit' }),
  ],
  groups: packages.map(pkg => {
    return {
      name: pkg,
      files: `packages/${pkg}/test-web/**/*.test.js`,
    };
  }),
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 80,
      branches: 60,
      functions: 60,
      lines: 80,
    },
  },
};
