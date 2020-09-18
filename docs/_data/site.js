/* eslint-disable */
const { getRocketValues } = require('@d4kmor/cli');

module.exports = async function () {
  const defaultValues = await getRocketValues();
  return {
    ...defaultValues,
    name: 'Open WC',
    description:
      'Open Web Components provides a set of defaults, recommendations and tools to help facilitate your web component project. Our recommendations include: developing, linting, testing, building, tooling, demoing, publishing and automating.',
    socialLinks: [
      {
        name: 'GitHub',
        url: 'https://github.com/open-wc/open-wc',
      },
    ],
    helpUrl: 'https://github.com/open-wc/open-wc/issues',
    logoAlt: 'O with occluded right edge to appear also as a C',
    iconColorMaskIcon: '#3f93ce',
    iconColorMsapplicationTileColor: '#1d3557',
    iconColorThemeColor: '#1d3557',
    analytics: 'UA-131782693-2',
  };
};
