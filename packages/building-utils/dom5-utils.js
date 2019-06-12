const { constructors, setAttribute, append } = require('./dom5-fork');

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
  createElement,
  createScript,
  createScriptModule,
};
