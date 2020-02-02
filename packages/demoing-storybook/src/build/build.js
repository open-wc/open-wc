const fs = require('fs-extra');
const path = require('path');
const getAssets = require('../shared/getAssets');
const toBrowserPath = require('../shared/toBrowserPath');
const { buildManager } = require('./rollup/buildManager');
const { buildPreview } = require('./rollup/buildPreview');

module.exports = async function build({
  storybookConfigDir,
  outputDir,
  managerPath,
  previewPath,
  storiesPatterns,
  rollupConfigDecorator,
  experimentalMdDocs,
  addons,
}) {
  const managerPathRelative = `/${path.relative(process.cwd(), require.resolve(managerPath))}`;
  const managerImport = `./${toBrowserPath(managerPathRelative)}`;

  const assets = getAssets({
    rootDir: process.cwd(),
    storybookConfigDir,
    managerImport,
    addons,
    absoluteImports: false,
  });

  const previewConfigPath = path.join(storybookConfigDir, 'preview.js');
  const previewConfigImport = fs.existsSync(path.join(process.cwd(), previewConfigPath))
    ? `./${toBrowserPath(previewConfigPath)}`
    : undefined;
  const relativePreviewPath = path.relative(process.cwd(), previewPath);
  const previewImport = `./${toBrowserPath(relativePreviewPath)}`;

  await fs.remove(outputDir);
  await fs.mkdirp(outputDir);

  await buildManager({ outputDir, indexHTML: assets.indexHTML });
  await buildPreview({
    outputDir,
    iframeHTML: assets.iframeHTML,
    storiesPatterns,
    previewImport,
    previewConfigImport,
    experimentalMdDocs,
    rollupConfigDecorator,
  });
};
