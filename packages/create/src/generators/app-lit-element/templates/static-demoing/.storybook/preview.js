import {
  addParameters,
  addDecorator,
  setCustomElements,
  withA11y
} from '@open-wc/demoing-storybook';

async function run() {
  const customElements = await (
    await fetch(new URL('../custom-elements.json', import.meta.url))
  ).json();
  setCustomElements(customElements);

  addDecorator(withA11y);

  addParameters({
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true
      }
    },
    docs: {
      iframeHeight: '200px'
    }
  });
}

run();
