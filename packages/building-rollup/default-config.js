import indexHTML from './plugins/rollup-plugin-index-html';
import createBasicConfig from './basic-config';

const production = !process.env.ROLLUP_WATCH;
const prefix = '[owc-building-rollup]';

export default function createDefaultConfig(options) {
  if (!options.input) {
    throw new Error(`${prefix}: missing option 'input'.`);
  }

  if (typeof options.input !== 'string' || !options.input.endsWith('.html')) {
    throw new Error(`${prefix}: input should point to a single .html file.`);
  }

  const basicConfig = createBasicConfig(options, false);
  const config = {
    ...basicConfig,
    plugins: [
      indexHTML({
        preventLegacyModuleRequest: true,
      }),
      ...basicConfig.plugins,
    ],
  };

  const basicLegacyConfig = createBasicConfig(options, true);
  const legacyConfig = {
    ...basicLegacyConfig,
    plugins: [
      indexHTML({
        legacy: true,
        babelPolyfills: true,
        webcomponentPolyfills: true,
      }),
      ...basicLegacyConfig.plugins,
    ],
  };

  return production ? [config, legacyConfig] : [config];
}
