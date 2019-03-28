import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/get-diffable-html.js',
  output: {
    file: 'bundle/get-diffable-html.js',
    intro: '// @ts-nocheck\n/* istanbul ignore file */\n/* eslint-disable */',
    format: 'esm',
  },
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    json(),
    builtins(),
    globals(),
    terser({
      output: {
        comments(node, comment) {
          return (
            comment.value.includes('@ts-nocheck') ||
            comment.value.includes('istanbul ignore file') ||
            comment.value.includes('eslint-disable')
          );
        },
      },
    }),
  ],
};
