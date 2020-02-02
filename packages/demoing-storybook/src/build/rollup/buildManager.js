const { createRollupConfigs } = require('./createRollupConfigs');
const { buildAndWrite } = require('./buildAndWrite');

/**
 * @param {object} param
 * @param {string} param.outputDir
 * @param {string} param.indexHTML
 */
async function buildManager({ outputDir, indexHTML }) {
  const configs = createRollupConfigs({
    outputDir,
    indexFilename: 'index.html',
    indexHTMLString: indexHTML,
  });

  // build sequentially instead of parallel because terser is multi
  // threaded and will max out CPUs.
  await buildAndWrite(configs[0]);
  await buildAndWrite(configs[1]);
}

module.exports = { buildManager };
