const path = require('path');
const mkdirp = require('mkdirp');
const { readFileSync, writeFileSync } = require('fs');
const { parse, serialize } = require('parse5');
const { constructors, setAttribute, append } = require('../../dom5-fork/index.js');

function pathJoin(...args) {
  // enfore / also on windows => as it is used for web pathes
  return path.join.apply(null, args).replace(/\\(?! )/g, '/');
}

/** Reads file as HTML AST */
function readHTML(file) {
  return parse(readFileSync(file, 'utf-8'));
}

/** Writes given HTML AST to output index.html */
function writeOutputHTML(dir, html) {
  const outputPath = pathJoin(dir, 'index.html');
  mkdirp.sync(path.dirname(outputPath));
  writeFileSync(outputPath, serialize(html));
}

function createElement(tag, attributes) {
  const element = constructors.element(tag);
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      setAttribute(element, key, attributes[key]);
    });
  }
  return element;
}

function createScript(attributes, code) {
  const script = createElement('script', attributes);
  if (code) {
    const scriptText = constructors.text(code);
    append(script, scriptText);
  }
  return script;
}

function createScriptModule(code) {
  return createScript({ type: 'module' }, code);
}

module.exports = {
  pathJoin,
  readHTML,
  writeOutputHTML,
  createElement,
  createScript,
  createScriptModule,
};
