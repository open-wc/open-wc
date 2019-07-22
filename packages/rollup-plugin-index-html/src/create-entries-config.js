const path = require('path');

const outputTypes = {
  es: 'module',
  esm: 'module',
  system: 'system',
};

/** @typedef {import('@open-wc/building-utils/index-html/create-index-html').EntriesConfig} EntriesConfig */

/**
 * @param {*} outputConfig
 * @param {string[]} files
 * @param {string[]} [preloadedFiles]
 * @param {string} [legacyDir]
 * @returns {EntriesConfig}
 */
function createEntriesConfig(outputConfig, files, preloadedFiles, legacyDir) {
  if (!(outputConfig.format in outputTypes)) {
    throw new Error(
      `Unsupported module format: ${outputConfig.format}. Supports formats: esm and system`,
    );
  }

  return {
    type: outputTypes[outputConfig.format],
    // if this is the legacy build, add the legacy folder to the output
    files: legacyDir ? files.map(f => path.posix.join(legacyDir, f)) : files,
    // only preload legacy files for now
    preloadedFiles: legacyDir ? undefined : preloadedFiles,
  };
}

module.exports = {
  createEntriesConfig,
};
