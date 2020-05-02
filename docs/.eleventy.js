const htmlMinTransform = require('./transforms/html-min-transform.js');
const eleventyUnified = require('./unified');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyUnified);

  eleventyConfig.addPassthroughCopy('styles.css');
  eleventyConfig.addPassthroughCopy('demoing/demo/custom-elements.json');
  eleventyConfig.addPassthroughCopy('manifest.json');
  eleventyConfig.addPassthroughCopy('**/*.{png,gif}');

  // Transforms
  eleventyConfig.addTransform('htmlmin', htmlMinTransform);

  eleventyConfig.addCollection('section', function (collection) {
    // This works _because_ of our current content. Something like https://github.com/Polymer/lit-html/blob/master/docs/.eleventy.js#L37
    // would be more robust, but there are likely other answers here.
    return collection.getFilteredByTag('section').reverse();
  });

  return {
    dir: { input: './', output: '../_site' },
    passthroughFileCopy: true,
  };
};
