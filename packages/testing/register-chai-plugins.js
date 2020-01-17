// es module plugins
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { chaiA11yAxe } from 'chai-a11y-axe';

import chai from './import-wrappers/chai.js';
// non es module plugins
import './import-wrappers/chai-dom.js';
import './import-wrappers/sinon-chai.js';

// @ts-ignore
chai.use(chaiDomDiff);
// @ts-ignore
chai.use(chaiA11yAxe);
