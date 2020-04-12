import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  outputDir: '../../_site/scoped-elements/demo/no-scope',
  legacyBuild: true,
});

export default merge(baseConfig, {
  input: './demo/no-scope/index.html',
});
