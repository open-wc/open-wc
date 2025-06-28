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
  watch: true,
  concurrency: 10,
  browsers: [
    playwrightLauncher({launchOptions: {args: ['--no-sandbox']}, product: 'chromium' }),
  ],
  groups: packages.map(pkg => {
    return {
      name: pkg,
      files: `packages/${pkg}/test-web/**/*.test.js`,
    };
  }),
  coverage: false,
};
