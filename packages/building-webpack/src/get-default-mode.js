module.exports = function getDefaultMode() {
  // webpack standard is to use --mode=production
  const modeArg = process.argv.find(arg => arg.startsWith('--mode='));
  if (modeArg) {
    return modeArg.replace('--mode=', '');
  }

  // our old convention was --mode production, so we remain backwards compatible with that
  const indexOf = process.argv.indexOf('--mode');
  return indexOf === -1 ? 'production' : process.argv[indexOf + 1];
};
