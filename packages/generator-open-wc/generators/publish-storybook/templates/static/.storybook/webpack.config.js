const path = require('path');

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  defaultConfig.resolve.modules.push('bower_components');

  defaultConfig.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/],
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  // Searches through all exclude rules and replaces them if they exclude node_modules
  // Replacement will exclude node_modules with the exeption of listed below packages
  for (let i = 0; i < defaultConfig.module.rules.length; i += 1) {
    const rule = defaultConfig.module.rules[i];
    if (rule.exclude) {
      for (let j = 0; j < rule.exclude.length; j += 1) {
        if (rule.exclude[j] === path.resolve('node_modules')) {
          rule.exclude[j] = modulePath => {
            return (
              /node_modules/.test(modulePath) &&
              !/node_modules\/lit-html/.test(modulePath) &&
              !/node_modules\/@open-wc/.test(modulePath)
            );
          };
        }
      }
    }
  }

  return defaultConfig;
};
