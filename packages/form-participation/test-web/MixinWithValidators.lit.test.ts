import { elementUpdated, expect, fixture, fixtureCleanup } from '@open-wc/testing';
import { FormControlMixin, Validator } from '../src';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { spy } from 'sinon';

const requiredValidator: Validator = {
  attribute: 'required',
  key: 'valueMissing',
  message: 'This field is required',
  callback(instance, value): boolean {
    return !!value;
  }
};

const otherValidator: Validator = {
  attribute: 'other',
  key: 'customError',
  message: 'will not trigger',
  callback() { return true; }
}

@customElement('form-control-lit-validators')
class FormControlLitValidators extends FormControlMixin(LitElement) {
  static get formControlValidators(): Validator[] {
    return [requiredValidator, otherValidator];
  }

  @query('div')
  validationTarget: HTMLElement;

  render() {
    return html`<div></div>`;
  }

  _onInput({ target }: Event & { target: HTMLInputElement }) {
    this.value = target.value;
  }
}

@customElement('with-checked')
class FormControlLitCheckedValidators extends FormControlLitValidators {
  checked = false;
  value = 'foo';
}

describe('The FormControlMixin using LitElement', () => {
  let form: Element;
  let el: FormControlLitValidators;
  let constructor: typeof FormControlLitValidators;

  beforeEach(async () => {
    form = await fixture(html`
      <form>
        <form-control-lit-validators
          name="formControl"
        ></form-control-lit-validators>
      </form>
    `);
    // @ts-ignore
    el = form.querySelector<FormControlLitValidators>('form-control-lit-validators');
    constructor = el.constructor as typeof FormControlLitValidators;
  });

  afterEach(fixtureCleanup);

  it('keeps a reference to validators', async () => {
    expect(constructor.formControlValidators.length).to.equal(2);
  });

  it('will track the observedAttributes relative to validators', async () => {
    expect(constructor.observedAttributes.includes('other')).to.be.true;
  });

  it('will return the validator from getValidator', async () => {
    // @ts-ignore
    expect(constructor.getValidator('required')).to.equal(requiredValidator);
  });

  it('will add validator attributes to observedAttributes', async () => {
    expect(constructor.observedAttributes.includes('required')).to.be.true;
  });

  it('will mark the validity state as invalid given the callback', async () => {
    expect(el.validity.valid).to.be.false;
  });

  it('will have a reference to the parent form', async () => {
    expect(el.form).to.equal(form);
  });

  it('will not recommend showing an error when pristine', async () => {
    expect(el.validity.valid).to.be.false;
    expect(el.showError).to.be.false;
  });

  it('will recommend showing an error when touched/not focused', async () => {
    expect(el.validity.valid).to.be.false;
    el.dispatchEvent(new Event('focus'));
    await elementUpdated(el as unknown as Element);
    // expect(el.showError).to.be.false;
    el.dispatchEvent(new Event('blur'));
    await elementUpdated(el as unknown as Element);
    expect(el.showError).to.be.true;
  });

  it('will not recommend showing an error when disabled', async () => {
    expect(el.validity.valid).to.be.false;
    el.dispatchEvent(new Event('focus'));
    await elementUpdated(el as unknown as Element);
    expect(el.showError).to.be.false;
    el.dispatchEvent(new Event('blur'));
    el.toggleAttribute('disabled', true);
    await elementUpdated(el as unknown as Element);
    expect(el.showError).to.be.false;
  });

  it('will get save the validationMessage', async () => {
    expect(el.validationMessage).to.equal(requiredValidator.message);
  });

  it('will evaluate when the value is set', async () => {
    expect(el.validity.valid).to.be.false;
    expect(el.validity.valueMissing).to.be.true;
    el.value = 'abc';
    expect(el.validity.valid).to.be.true;
    expect(el.validity.valueMissing).to.be.false;
  });

  it('will respond to validator attribute changes', async () => {
    const callbackSpy = spy(requiredValidator, 'callback');
    el.toggleAttribute('required', true);
    await elementUpdated(el as unknown as Element);
    expect(callbackSpy.called).to.be.true;
  });
});

describe('FormControl checked behavior', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = await fixture(html`<form @submit="${e => e.preventDefault()}">
      <with-checked name="with-checked"></with-checked>
    </form>`);
    el = form.querySelector('with-checked');
  });

  afterEach(fixtureCleanup);

  it('will not participate in the form if checked is false', async () => {
    expect(new FormData(form).get('with-checked')).to.equal(null);
  });

  it('will participate in the form if checked is true', async () => {
    el.checked = true;
    await elementUpdated(el);
    expect(new FormData(form).get('with-checked')).to.equal('foo');
  });

  it('will reset checked on form reset', async () => {
    el.checked = true;
    await elementUpdated(el);
    expect(new FormData(form).get('with-checked')).to.equal('foo');
    form.reset();
    await elementUpdated(el);
    expect(new FormData(form).get('with-checked')).to.equal(null);
  });
});
