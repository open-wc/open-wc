import { expect } from './setup.js';
import { MyElement } from '../src/my-element';
import '../src/my-element';

describe('MyElement', () => {
  it('works', async () => {
    const el = document.createElement('my-element') as MyElement;
    document.body.appendChild(el);

    await el.updateComplete;
    expect(el.shadowRoot.textContent).to.include('Hello world');

    el.msg = 'karma';
    
    await el.updateComplete;
    expect(el.shadowRoot.textContent).to.include('Hello karma');
  });
});
