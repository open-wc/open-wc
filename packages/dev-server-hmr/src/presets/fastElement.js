const patch = `import { FASTElement, FASTElementDefinition } from '@microsoft/fast-element';
FASTElement.prototype.hotReplacedCallback = function hotReplacedCallback() {
  const newDefinition = FASTElementDefinition.forType(this.constructor);
  if (newDefinition) {
    if (newDefinition.styles) {
      this.$fastController.styles = newDefinition.styles;
    }
    if (newDefinition.template) {
      this.$fastController.template = newDefinition.template;
    }
  }
};`;

const fastElement = {
  decorators: [{ name: 'customElement', import: '@microsoft/fast-element' }],
  baseClasses: [{ name: 'FASTElement', import: '@microsoft/fast-element' }],
  patch,
};

module.exports = { fastElement };
