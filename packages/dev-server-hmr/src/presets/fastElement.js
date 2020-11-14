const { WC_HMR_MODULE_RUNTIME } = require('../constants');

const patch = `import { FASTElement, FASTElementDefinition } from '@microsoft/fast-element';
import { updateClassMembers } from '${WC_HMR_MODULE_RUNTIME}';

FASTElement.prototype.hotReplaceCallback = function hotReplaceCallback(newClass) {
  const newDefinition = FASTElementDefinition.forType(newClass);
  if (newDefinition) {
    this.$fastController.styles = newDefinition.styles;
    this.$fastController.template = newDefinition.template;
  }
};`;

const fastElement = {
  decorators: [{ name: 'customElement', import: '@microsoft/fast-element' }],
  baseClasses: [{ name: 'FASTElement', import: '@microsoft/fast-element' }],
  patch,
};

module.exports = { fastElement };
