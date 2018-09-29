module.exports = {
  hooks: {
    'pre-commit': 'npm run lint',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
