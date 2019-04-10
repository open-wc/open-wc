/* eslint-disable class-methods-use-this */
import { expect } from '@bundled-es-modules/chai';
import { elementUpdated } from '../src/elementUpdated.js';
import { nextFrame } from '../src/helpers.js';

describe('elementUpdated', () => {
  it('will wait for one frame', async () => {
    let counter = 0;
    nextFrame().then(() => {
      counter += 1;
    });

    class TmpElement extends HTMLElement {}
    const el = Object.create(TmpElement.prototype);
    await elementUpdated(el);
    expect(counter).to.equal(1);
  });

  it('will wait for lit-element to be updated via el.updateComplete', async () => {
    let counter = 0;
    class TmpElement extends HTMLElement {
      get updateComplete() {
        return new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
          counter += 1;
        });
      }
    }
    const el = Object.create(TmpElement.prototype);

    await elementUpdated(el);
    expect(counter).to.equal(1);
  });

  it('will wait for stencil to be updated via el.componentOnReady()', async () => {
    let counter = 0;
    class TmpElement extends HTMLElement {
      // @ts-ignore
      componentOnReady() {
        return new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
          counter += 1;
        });
      }
    }
    const el = Object.create(TmpElement.prototype);

    await elementUpdated(el);
    expect(counter).to.equal(1);
  });
});
