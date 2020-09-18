const pluginMdjs = require('./_plugin-mdjs/index.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs);

  eleventyConfig.addPassthroughCopy('./styles.css');
  eleventyConfig.addPassthroughCopy('./demoing/demo/custom-elements.json');
  eleventyConfig.addPassthroughCopy('./manifest.json');
  eleventyConfig.addPassthroughCopy('./**/*.{png,gif}');

  eleventyConfig.addCollection('section', function (collection) {
    // This works _because_ of our current content. Something like https://github.com/Polymer/lit-html/blob/master/docs/.eleventy.js#L37
    // would be more robust, but there are likely other answers here.
    return collection.getFilteredByTag('section').reverse();
  });

  // 11ty needs this as it apparently reads this config from multiple files
  // and only if we provide this hook we can actually override later when we
  // programmatically trigger 11ty
  // @TODO: create an issue and find a nicer way to add this transformer
  eleventyConfig.addTransform('hook-for-rocket');

  return {
    dir: { input: './', output: '../_site-dev' },
    passthroughFileCopy: true,
  };
};
