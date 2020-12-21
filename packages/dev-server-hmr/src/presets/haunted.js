const patch = `import { WebComponentHmr } from '/__web-dev-server__/wc-hmr/runtime.js';

HTMLElement.prototype.hotReplacedCallback = function hotReplacedCallback() {
  const temp = new this.constructor();
  this._scheduler.renderer = temp._scheduler.renderer;
  this._scheduler.update();
};
`;

const haunted = {
  functions: [{ name: 'component', import: 'haunted' }],
  patch,
};

module.exports = { haunted };
