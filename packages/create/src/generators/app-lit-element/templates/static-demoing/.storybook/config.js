import { configure, addDecorator, setCustomElements } from '@storybook/web-components';
import { withA11y } from '@storybook/addon-a11y';
import '@storybook/addon-console';

import customElements from '../custom-elements.json';

setCustomElements(customElements);

addDecorator(withA11y);

// force full reload to not reregister web components
const req = require.context('../components', true, /\.stories\.(js|mdx)$/);
configure(req, module);
if (module.hot) {
  module.hot.accept(req.id, () => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    window.location.reload();
  });
}
