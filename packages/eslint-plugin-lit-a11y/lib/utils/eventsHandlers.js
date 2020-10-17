/**
 * Common event handlers for HTML element event binding.
 */

const eventHandlersByType = {
  clipboard: ['@copy', '@cut', '@paste'],
  composition: ['@compositionend', '@compositionstart', '@compositionupdate'],
  keyboard: ['@keydown', '@keypress', '@keyup'],
  focus: ['@focus', '@blur'],
  form: ['@change', '@input', '@submit'],
  mouse: [
    '@click',
    '@contextmenu',
    '@dblclick',
    '@doubleclick',
    '@drag',
    '@dragend',
    '@dragenter',
    '@dragexit',
    '@dragleave',
    '@dragover',
    '@dragstart',
    '@drop',
    '@mousedown',
    '@mouseenter',
    '@mouseleave',
    '@mousemove',
    '@mouseout',
    '@mouseover',
    '@mouseup',
  ],
  selection: ['@select'],
  touch: ['@touchcancel', '@touchend', '@touchmove', '@touchstart'],
  ui: ['@scroll'],
  wheel: ['@wheel'],
  media: [
    '@abort',
    '@canplay',
    '@canplaythrough',
    '@durationchange',
    '@emptied',
    '@encrypted',
    '@ended',
    '@error',
    '@loadeddata',
    '@loadedmetadata',
    '@loadstart',
    '@pause',
    '@play',
    '@playing',
    '@progress',
    '@ratechange',
    '@seeked',
    '@seeking',
    '@stalled',
    '@suspend',
    '@timeupdate',
    '@volumechange',
    '@waiting',
  ],
  image: ['@load', '@error'],
  animation: ['@animationstart', '@animationend', '@animationiteration'],
  transition: ['@transitionend'],
};

const eventHandlers = Object.keys(eventHandlersByType).reduce(
  (accumulator, type) => accumulator.concat(eventHandlersByType[type]),
  [],
);

module.exports = {
  eventHandlers,
  eventHandlersByType,
};
