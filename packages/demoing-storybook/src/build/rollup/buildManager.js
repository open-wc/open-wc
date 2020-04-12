const { createRollupConfig } = require('./createRollupConfig');
const { buildAndWrite } = require('./buildAndWrite');

/**
 * @param {object} param
 * @param {string} param.outputDir
 * @param {string} param.indexHTML
 */
async function buildManager({ outputDir, indexHTML }) {
  const config = createRollupConfig({
    outputDir,
    indexFilename: 'index.html',
    indexHTMLString: indexHTML,
  });

  await buildAndWrite(config);
}

module.exports = { buildManager };
