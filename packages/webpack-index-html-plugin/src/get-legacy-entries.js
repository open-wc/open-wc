const fs = require('fs');
const { PLUGIN_NAME } = require('./utils');

const matchEntry = entry => file => file.startsWith(entry);
const mapLegacyEntries = (entries, files) =>
  entries.map(entry => `legacy/${files.find(matchEntry(entry))}`);

/**
 * Waits for webpack to output the legacy build on the file system, then collects the legacy entry points.
 * @param {number} timeout
 * @param {string} legacyOutputPath
 * @param {string[]} entries
 * @param {Map<string, string[]>} entryNamesForVariations
 */
async function getLegacyEntries(timeout, legacyOutputPath, entries, entryNamesForVariations) {
  return new Promise((resolve, reject) => {
    let intervalId;
    let logIntervalId;
    let timeoutId;

    function task() {
      if (fs.existsSync(legacyOutputPath)) {
        const files = fs.readdirSync(legacyOutputPath);

        if (entries.every(entry => files.some(matchEntry(entry)))) {
          if (!entryNamesForVariations) {
            const legacyEntries = mapLegacyEntries(entries, files);
            resolve({ entries: legacyEntries });
          } else {
            const legacyEntryNamesForVariations = new Map();
            entryNamesForVariations.forEach((entryNamesForVariation, variation) => {
              const legacyEntries = mapLegacyEntries(entryNamesForVariation, files);
              legacyEntryNamesForVariations.set(variation, legacyEntries);
            });
            resolve({ entryNamesForVariations: legacyEntryNamesForVariations });
          }

          clearInterval(intervalId);
          clearInterval(logIntervalId);
          clearTimeout(timeoutId);
        }
      }
    }

    function logTask() {
      /* eslint-disable-next-line no-console */
      console.log(
        `[${PLUGIN_NAME}]: Waiting for legacy build to finish before generating output index.html...`,
      );
    }

    intervalId = setInterval(task, 500);
    logIntervalId = setInterval(logTask, 1000 * 30);
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearInterval(logIntervalId);
      reject(
        new Error(
          `Did not find any legacy entries in output dir ${legacyOutputPath} within ${timeout} ms. You can increase the timeout with the legacyTimeout option. Note that legacy is not supported with webpack-dev-server.`,
        ),
      );
    }, timeout);
  });
}

module.exports.getLegacyEntries = getLegacyEntries;
