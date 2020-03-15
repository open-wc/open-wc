const { rollup } = require('rollup');

/**
 * @param {object} config
 */
async function buildAndWrite(config) {
  const bundle = await rollup(config);
  await bundle.write(config.output);
}

module.exports = { buildAndWrite };
