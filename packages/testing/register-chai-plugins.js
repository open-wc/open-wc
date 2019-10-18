// non es module plugins
import 'chai-dom';
import 'sinon-chai';

// es module plugins
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { chaiA11yAxe } from 'chai-a11y-axe';

// @ts-ignore
window.chai.use(chaiDomDiff);
// @ts-ignore
window.chai.use(chaiA11yAxe);
