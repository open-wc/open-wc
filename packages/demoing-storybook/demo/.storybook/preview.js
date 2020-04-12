import { addParameters, addDecorator, setCustomElements, withA11y } from '../../index.js';

addDecorator(withA11y);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    showRoots: true,
  },
  docs: {
    iframeHeight: '200px',
  },
});

async function run() {
  const customElements = await fetch(new URL('../custom-elements.json')).json();

  setCustomElements(customElements);
}

run();
