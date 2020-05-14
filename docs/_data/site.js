let url = '/';

switch (process.env.CONTEXT) {
  case 'production':
    url = process.env.URL;
    break;
  case 'deploy-preview':
    url = process.env.DEPLOY_URL;
    break;
  case 'branch-deploy':
    url = process.env.DEPLOY_PRIME_URL;
    break;
  default:
    break;
}

module.exports = {
  name: 'Open Web Components',
  shortDesc:
    'Open Web Components provides a set of defaults, recommendations and tools to help facilitate your web component project. Our recommendations include: developing, linting, testing, building, tooling, demoing, publishing and automating.',
  url,
};
