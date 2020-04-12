import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  outputDir: '../../_site/dedupe-mixin/demo/no-dedupe',
  legacyBuild: true,
});

export default merge(baseConfig, {
  input: './demo-typed/no-dedupe/index.html',
});
