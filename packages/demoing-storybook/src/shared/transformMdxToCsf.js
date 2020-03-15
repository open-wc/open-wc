const mdx = require('@mdx-js/mdx');
const { transformAsync } = require('@babel/core');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

const compilers = [createCompiler({})];

/**
 * @param {string} body
 * @param {string} filePath
 */
async function transformMdxToCsf(body, filePath) {
  const jsx = `
      import * as React from 'storybook-prebuilt/react.js';
      import { mdx } from 'storybook-prebuilt/addon-docs/blocks.js';

      ${await mdx(body, { compilers, filepath: filePath })}
    `.replace('@storybook/addon-docs/blocks', 'storybook-prebuilt/addon-docs/blocks.js');

  return transformAsync(jsx, {
    filename: filePath,
    sourceMaps: true,
    plugins: [require.resolve('@babel/plugin-transform-react-jsx')],
  });
}

module.exports = { transformMdxToCsf };
