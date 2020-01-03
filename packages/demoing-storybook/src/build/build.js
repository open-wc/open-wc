const { rollup } = require('rollup');
const { createCompatibilityConfig } = require('@open-wc/building-rollup');
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const indexHTML = require('rollup-plugin-index-html');
const cpy = require('rollup-plugin-cpy');
const fs = require('fs-extra');
const path = require('path');
const createMdxToJsTransformer = require('../shared/createMdxToJsTransformer');
const createAssets = require('../shared/getAssets');

async function buildManager(outputDir, assets) {
  await fs.writeFile(path.join(outputDir, 'index.html'), assets.indexHTML);
  await fs.writeFile(path.join(outputDir, assets.managerScriptSrc), assets.managerCode);
}

async function buildPreview(outputDir, previewPath, assets) {
  const transformMdxToJs = createMdxToJsTransformer({ previewImport: previewPath });

  const transformMdxPlugin = {
    transform(code, id) {
      if (id.endsWith('.mdx')) {
        return transformMdxToJs(id, code);
      }
      return null;
    },
  };

  const configs = createCompatibilityConfig({
    input: 'noop',
    outputDir,
    extensions: [...DEFAULT_EXTENSIONS, 'mdx'],
    plugins: { indexHTML: false },
  });

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
    cpy({
      files: ['**/custom-elements.json'],
      dest: outputDir,
      options: {
        parents: true,
      },
    }),
  );

  // @ts-ignore
  const bundles = await Promise.all([rollup(configs[0]), rollup(configs[1])]);
  await bundles[0].write(configs[0].output);
  await bundles[1].write(configs[1].output);
}

module.exports = async function build({
  storybookConfigDir,
  outputDir,
  managerPath,
  previewPath,
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
    buildPreview(outputDir, previewPath, assets),
  ]);
};
