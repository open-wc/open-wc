const mdx = require('@mdx-js/mdx');
const path = require('path');
const { transformAsync } = require('@babel/core');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const toBrowserPath = require('./toBrowserPath');

const compilers = [createCompiler({})];

module.exports = function createMdxToJsTransformer(rootDir) {
  let urlToPrebuilt = require.resolve('@open-wc/storybook-prebuilt/dist/preview.js');
  if (rootDir) {
    urlToPrebuilt = toBrowserPath(`/${path.relative(rootDir, urlToPrebuilt)}`);
  }

  return async function transformMdxToJs(filePath, body) {
    const jsx = `
      import { React, mdx } from '${urlToPrebuilt}';

      ${await mdx(body, { compilers, filepath: filePath })}
    `.replace('@storybook/addon-docs/blocks', urlToPrebuilt);

    return transformAsync(jsx, {
      filename: filePath,
      sourceMaps: true,
      plugins: [require.resolve('@babel/plugin-transform-react-jsx')],
    });
  };
};
