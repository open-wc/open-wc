const listFiles = require('./listFiles');

/**
 * Lists all files using the specified globs, starting from the given root directory.
 *
 * Will return all matching file paths
 */
module.exports = async function storiesPatternsToFiles(storiesPatterns, rootDir) {
  const listFilesPromises = storiesPatterns.map(pattern => listFiles(pattern, rootDir));
  const arrayOfFilesArrays = await Promise.all(listFilesPromises);
  const files = [];

  for (const filesArray of arrayOfFilesArrays) {
    for (const filePath of filesArray) {
      files.push(filePath);
    }
  }

  return files;
};
