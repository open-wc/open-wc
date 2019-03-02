import path from 'path';
import mkdirp from 'mkdirp';
import { readFileSync, writeFileSync } from 'fs';
import { parse, serialize } from 'parse5';
import { constructors, setAttribute, append } from 'dom5';

/** Reads file as HTML AST */
export function readHTML(file) {
  return parse(readFileSync(file, 'utf-8'));
}

/** Writes given HTML AST to output index.html */
export function writeOutputHTML(dir, html) {
  const outputPath = path.join(dir, 'index.html');
  mkdirp.sync(path.dirname(outputPath));
  writeFileSync(outputPath, serialize(html));
}

export function createElement(tag, attributes) {
  const element = constructors.element(tag);
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      setAttribute(element, key, attributes[key]);
    });
  }
  return element;
}

export function createScript(attributes, code) {
  const script = createElement('script', attributes);
  if (code) {
    const scriptText = constructors.text(code);
    append(script, scriptText);
  }
  return script;
}

export function createScriptModule(code) {
  return createScript({ type: 'module' }, code);
}
