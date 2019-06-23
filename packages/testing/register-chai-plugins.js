import { chai } from '@bundled-es-modules/chai';
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { chaiA11yAxe } from 'chai-a11y-axe';

chai.use(chaiDomDiff);
chai.use(chaiA11yAxe);
