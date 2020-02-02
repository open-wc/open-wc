const { createRollupConfigs } = require('./createRollupConfigs');
const { buildAndWrite } = require('./buildAndWrite');
const { injectStories } = require('../../shared/injectStories');
const { collectStoryIdsPlugin } = require('./collectStoryIdsPlugin');
const { transformMdxPlugin } = require('./transformMdxPlugin');
const { injectOrderedExportsPlugin } = require('./injectOrderedExportsPlugin');
const { copyCustomElementsJsonPlugin } = require('./copyCustomElementsJsonPlugin');

/**
 * @param {object} param
 * @param {string} param.outputDir
 * @param {string} param.iframeHTML
 * @param {string} param.previewImport
 * @param {string} param.previewConfigImport
 * @param {string[]} param.storiesPatterns
 * @param {(config: object) => object | undefined} param.rollupConfigDecorator
 * @param {boolean} param.experimentalMdDocs
 */
async function buildPreview({
  outputDir,
  iframeHTML,
  previewImport,
  previewConfigImport,
  storiesPatterns,
  rollupConfigDecorator,
  experimentalMdDocs,
}) {
  const { html } = await injectStories({
    iframeHTML,
    previewImport,
    previewConfigImport,
    storiesPatterns,
    absolutePath: false,
    rootDir: process.cwd(),
  });

  let configs = createRollupConfigs({
    outputDir,
    indexFilename: 'iframe.html',
    indexHTMLString: html,
  });

  configs.forEach(config => {
    // stories, filled by collectStoryIdsPlugin, shared by the other plugins
    const storyIds = [];

    config.plugins.unshift(
      collectStoryIdsPlugin(storyIds),
      transformMdxPlugin(storyIds, experimentalMdDocs),
      injectOrderedExportsPlugin(storyIds),
      copyCustomElementsJsonPlugin(outputDir),
    );
  });

  if (rollupConfigDecorator) {
    configs = rollupConfigDecorator(configs) || configs;
  }

  // build sequentially instead of parallel because terser is multi
  // threaded and will max out CPUs.
  await buildAndWrite(configs[0]);
  await buildAndWrite(configs[1]);
}

module.exports = { buildPreview };
