/* eslint-disable class-methods-use-this */
import { expect } from '@bundled-es-modules/chai';
import { elementUpdated } from '../elementUpdated.js';
import { nextFrame } from '../helpers.js';

describe('elementUpdated', () => {
  it('will wait for one frame', async () => {
    let counter = 0;
    nextFrame().then(() => {
      counter += 1;
    });

    class TmpElement {}
    const el = new TmpElement();
    await elementUpdated(el);
    expect(counter).to.equal(1);
  });

  it('will wait for lit-element to be updated via el.updateComplete', async () => {
    let counter = 0;
    class TmpElement {
      get updateComplete() {
        return new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
          counter += 1;
        });
      }
    }
    const el = new TmpElement();

    await elementUpdated(el);
    expect(counter).to.equal(1);
  });

  it('will wait for stencil to be updated via el.componentOnReady()', async () => {
    let counter = 0;
    class TmpElement {
      componentOnReady() {
        return new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
          counter += 1;
        });
      }
    }
    const el = new TmpElement();

    await elementUpdated(el);
    expect(counter).to.equal(1);
  });
});
