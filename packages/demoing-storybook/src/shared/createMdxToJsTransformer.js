const mdx = require('@mdx-js/mdx');
const { transformAsync } = require('@babel/core');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

const compilers = [createCompiler({})];

module.exports = function createMdxToJsTransformer({ previewImport }) {
  return async function transformMdxToJs(filePath, body) {
    const jsx = `
      import { React, mdx } from '${previewImport}';

      ${await mdx(body, { compilers, filepath: filePath })}
    `.replace('@storybook/addon-docs/blocks', previewImport);

    return transformAsync(jsx, {
      filename: filePath,
      sourceMaps: true,
      plugins: [require.resolve('@babel/plugin-transform-react-jsx')],
    });
  };
};
