/** @typedef {import('@babel/core').types.File} File */

const { parse } = require('@babel/parser');
const { codeFrameColumns } = require('@babel/code-frame');
const {
  isExportDefaultDeclaration,
  isExpression,
  isIdentifier,
  variableDeclaration,
  variableDeclarator,
  identifier,
} = require('@babel/core').types;
const { default: generate } = require('@babel/generator');

/**
 * @param {string} path
 */
function createMissingExportError(path) {
  return new Error(
    `${path} does not contain a default export with the page title. This is required for Storybook.`,
  );
}

/**
 * @param {string} code
 * @param {string} path
 * @param {boolean} [highlightError]
 * @returns {string}
 */
function renameDefaultExport(code, path, highlightError = true) {
  if (!code) {
    throw createMissingExportError(path);
  }

  /** @type {File} */
  let file;
  try {
    file = parse(code, { sourceType: 'module', sourceFilename: path });
  } catch (error) {
    const codeFrame = codeFrameColumns(
      code,
      { start: error.loc },
      { highlightCode: highlightError },
    );
    throw new Error(`${error.message}\n\n${codeFrame}`);
  }
  if (!file) {
    throw createMissingExportError(path);
  }

  const { body } = file.program;
  const [defaultExport] = body.filter(n => isExportDefaultDeclaration(n));
  if (!defaultExport || !isExportDefaultDeclaration(defaultExport)) {
    throw createMissingExportError(path);
  }

  if (!isExpression(defaultExport.declaration) && !isIdentifier(defaultExport.declaration)) {
    throw createMissingExportError(path);
  }

  // replace the user's default export with a variable, so that we can add it to the storybook
  // default export later
  const defaultExportReplacement = variableDeclaration('const', [
    variableDeclarator(identifier('__export_default__'), defaultExport.declaration),
  ]);
  body.splice(body.indexOf(defaultExport), 1, defaultExportReplacement);

  return generate(file).code;
}

module.exports = {
  renameDefaultExport,
};
