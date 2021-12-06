import { elementUpdated, expect, fixture, fixtureCleanup } from '@open-wc/testing';
import { FormControlMixin, Validator } from '../src';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

const validatorOne: Validator = {
  key: 'customError',
  message() {
    return 'value cannot be foo';
  },
  callback(instance, value): boolean {
    return value !== 'foo';
  }
};

const validatorTwo: Validator = {
  key: 'badInput',
  message: 'validatorTwo',
  callback(instance, value): boolean {
    return value !== 'invalid';
  }
};

@customElement('validator-message-demo')
class ValidatorMessageDemo extends FormControlMixin(LitElement) {
  static get formControlValidators(): Validator[] {
    return [validatorOne, validatorTwo];
  }

  @query('div')
  validationTarget: HTMLElement;

  render() {
    return html`<div></div>`;
  }

  validityCallback(key) {
    return key === 'badInput' ? 'from validityCallback' : null;
  }
}


describe('The FormControlMixin using LitElement', () => {
  let form: HTMLFormElement;
  let el: ValidatorMessageDemo;

  beforeEach(async () => {
    form = await fixture<HTMLFormElement>(html`
      <form>
        <validator-message-demo
          name="message-demo"
        ></validator-message-demo>
      </form>
    `);
    // @ts-ignore
    el = form.querySelector<FormControlLitValidators>('validator-message-demo');
  });

  afterEach(fixtureCleanup);

  it('will evaluate the returned value of the function', async () => {
    el.value = 'foo';
    await elementUpdated(el);
    expect(el.validationMessage).to.equal('value cannot be foo');
  });

  it('will call evaluate an error message ', async () => {
    el.value = 'invalid';
    await elementUpdated(el);
    expect(el.validationMessage).to.equal('from validityCallback');
  });
});
