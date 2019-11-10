const mdx = require('@mdx-js/mdx');
const { transformAsync } = require('@babel/core');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

const compilers = [createCompiler({})];

module.exports = function createMdxToJsTransformer(relativeToCwd = true) {
  let urlToPrebuilt = require.resolve('@open-wc/storybook-prebuilt/dist/preview.js');
  if (relativeToCwd) {
    urlToPrebuilt = urlToPrebuilt.replace(process.cwd(), '');
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
