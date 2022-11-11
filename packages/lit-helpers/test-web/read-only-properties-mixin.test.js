import { expect, html, fixture, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement } from 'lit';
import { ReadOnlyPropertiesMixin } from '../src/read-only-properties-mixin.js';

describe('ReadOnlyPropertiesMixin', () => {
  let element;
  beforeEach(async () => {
    const ReadOnlyElement = unsafeStatic(
      defineCE(
        class extends ReadOnlyPropertiesMixin(LitElement) {
          static get properties() {
            return {
              publicString: { type: String },
              readOnlyString: { type: String, readOnly: true },
            };
          }

          constructor() {
            super();
            this.readOnlyString = 'readOnlyString';
          }
        },
      ),
    );
    element = await fixture(html`<${ReadOnlyElement}></${ReadOnlyElement}>`);
  });

  it('defines a read only property', async () => {
    const initial = element.readOnlyString;
    element.readOnlyString = Date.now().toString(36);
    expect(element.readOnlyString).to.equal(initial);
  });

  it('exposes `setReadOnlyProperties()` to "privately" set properties', async () => {
    const privately = Date.now().toString(36);
    await element.setReadOnlyProperties({ readOnlyString: privately });
    expect(element.readOnlyString).to.equal(privately);
  });
});
