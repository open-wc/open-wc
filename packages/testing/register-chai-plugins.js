// es module plugins
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { chaiA11yAxe } from 'chai-a11y-axe';

// remove esline-disable when https://github.com/esm-bundle/chai/pull/61 is merged
/* eslint-disable-next-line import/no-unresolved */
import chai from '@esm-bundle/chai';
// non es module plugins
import chaiDom from './plugins/chai-dom.js';
import sinonChai from './plugins/sinon-chai.js';

chai.use(chaiDomDiff);
chai.use(chaiA11yAxe);
chai.use(chaiDom);
chai.use(sinonChai);
