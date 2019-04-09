/**
 * Renames .md files to .js so that karma does not flag warnings for unknown file types.
 */
function snapshotFilenamePreprocessor() {
  return (content, file, done) => {
    /* eslint-disable no-param-reassign */
    file.path = file.path.replace('.md', '.snapshot.js');
    done(content);
  };
}

module.exports = {
  'preprocessor:snapshot-filename': ['factory', snapshotFilenamePreprocessor],
};
