const { rollup } = require('rollup');
const { createCompatibilityConfig } = require('@open-wc/building-rollup');
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const indexHTML = require('rollup-plugin-index-html');
const fs = require('fs-extra');
const path = require('path');
const MagicString = require('magic-string');
const createMdxToJsTransformer = require('../shared/createMdxToJsTransformer');
const { createOrderedExports } = require('../shared/createOrderedExports');
const createAssets = require('../shared/getAssets');
const listFiles = require('../shared/listFiles');

const injectOrderedExportsPlugin = storyFiles => ({
  async transform(code, id) {
    if (storyFiles.includes(id)) {
      const orderedExports = await createOrderedExports(code);
      if (!orderedExports) {
        return null;
      }

      // @ts-ignore
      const ms = new MagicString(code);
      ms.append(`\n\n${orderedExports}`);

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }),
      };
    }
    return null;
  },
});

function copyCustomElementsJsonPlugin(outputRootDir) {
  return {
    async generateBundle() {
      const files = await listFiles(
        `!(node_modules|web_modules|bower_components|${outputRootDir})/**/custom-elements.json`,
        process.cwd(),
      );

      for (const file of files) {
        const destination = file.replace(process.cwd(), '');

        this.emitFile({
          type: 'asset',
          fileName: destination.substring(1, destination.length),
          source: fs.readFileSync(file, 'utf-8'),
        });
      }
    },
  };
}

async function buildManager(outputDir, assets) {
  await fs.writeFile(path.join(outputDir, 'index.html'), assets.indexHTML);
  await fs.writeFile(path.join(outputDir, assets.managerScriptSrc), assets.managerCode);
}

async function buildPreview(outputDir, previewPath, assets, storyFiles) {
  const transformMdxToJs = createMdxToJsTransformer({ previewImport: previewPath });
  const configs = createCompatibilityConfig({
    input: 'noop',
    outputDir,
    extensions: [...DEFAULT_EXTENSIONS, 'mdx'],
    babelExclude: ['**/@open-wc/storybook-prebuilt/**/*'],
    terserExclude: ['storybook-preview*'],
    plugins: { indexHTML: false },
  });

  // force storybook preview into it's own chunk so that we can skip minifying it
  const manualChunks = {
    'storybook-preview': [require.resolve('@open-wc/storybook-prebuilt/dist/preview.js')],
  };
  configs[0].manualChunks = manualChunks;
  configs[1].manualChunks = manualChunks;

  const transformMdxPlugin = {
    transform(code, id) {
      if (id.endsWith('.mdx')) {
        return transformMdxToJs(id, code);
      }
      return null;
    },
  };

  configs[0].output.dir = path.join(outputDir, 'legacy');
  configs[1].output.dir = outputDir;

  configs[0].plugins.unshift(
    indexHTML({
      indexFilename: 'iframe.html',
      indexHTMLString: assets.iframeHTML,
      multiBuild: true,
      legacy: true,
      polyfills: {
        dynamicImport: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
        systemJs: true,
        fetch: true,
      },
    }),
    transformMdxPlugin,
    injectOrderedExportsPlugin(storyFiles),
    copyCustomElementsJsonPlugin(outputDir),
  );

  configs[1].plugins.unshift(
    indexHTML({
      indexFilename: 'iframe.html',
      indexHTMLString: assets.iframeHTML,
      multiBuild: true,
      legacy: false,
      polyfills: {
        dynamicImport: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
        systemJs: true,
        fetch: true,
      },
    }),
    transformMdxPlugin,
    injectOrderedExportsPlugin(storyFiles),
    copyCustomElementsJsonPlugin(outputDir),
  );

  // build sequentially instead of parallel because terser is multi
  // threaded and will max out CPUs
  // @ts-ignore
  const modernBundle = await rollup(configs[0]);
  // @ts-ignore
  const legacyBundle = await rollup(configs[1]);
  await modernBundle.write(configs[0].output);
  await legacyBundle.write(configs[1].output);
}

module.exports = async function build({
  storybookConfigDir,
  outputDir,
  managerPath,
  previewPath,
  storyFiles,
  storyUrls,
}) {
  const assets = createAssets({
    storybookConfigDir,
    managerPath,
    previewImport: previewPath,
    storyUrls,
  });

  await fs.remove(outputDir);
  await fs.mkdirp(outputDir);

  await Promise.all([
    buildManager(outputDir, assets),
    buildPreview(outputDir, previewPath, assets, storyFiles),
  ]);
};
