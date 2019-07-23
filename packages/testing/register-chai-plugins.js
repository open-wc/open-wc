import { chai } from '@bundled-es-modules/chai';
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { a11y } from '@open-wc/testing-a11y';

chai.use(chaiDomDiff);
chai.use(a11y);
