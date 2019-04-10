const { readFileSync } = require('fs');
const { parse } = require('parse5');

/** Reads file as HTML AST */
function readHTML(file) {
  return parse(readFileSync(file, 'utf-8'));
}

module.exports = {
  readHTML,
};
