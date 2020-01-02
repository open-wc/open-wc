const mdx = require('@mdx-js/mdx');
const path = require('path');
const { transformAsync } = require('@babel/core');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const toBrowserPath = require('./toBrowserPath');

const compilers = [createCompiler({})];

module.exports = function createMdxToJsTransformer({ rootDir, previewPath }) {
  const previewPathRelative = rootDir ? `/${path.relative(rootDir, previewPath)}` : previewPath;
  const previewImport = toBrowserPath(previewPathRelative);

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
