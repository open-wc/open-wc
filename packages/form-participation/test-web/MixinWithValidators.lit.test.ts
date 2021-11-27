import { aTimeout, elementUpdated, expect, fixture, fixtureCleanup } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { FormControlMixin, formValues, Validator } from '../src';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

const alwaysRequiredValidator: Validator = {
  attribute: 'required',
  key: 'valueMissing',
  message: 'This field is required',
  callback(instance, value): boolean {
    return !!value;
  }
};

@customElement('form-control-lit-validators')
class FormControlLitValidators extends FormControlMixin(LitElement) {
  static get formControlValidators(): Validator[] {
    return [alwaysRequiredValidator];
  }

  @query('input')
  validationTarget: HTMLElement;

  render() {
    return html`<input
      @input="${this._onInput}"
      .value="${live(this.value)}"
    >`;
  }

  _onInput({ target }: Event & { target: HTMLInputElement }) {
    this.value = target.value;
  }
}

describe('The FormControlMixin using LitElement', () => {
  let form: Element;
  let el: FormControlLitValidators;
  let constructor: typeof FormControlLitValidators;

  const getFormValues = () => {
    return formValues(form as unknown as HTMLFormElement);
  };

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
    expect(constructor.formControlValidators.length).to.equal(1);
  });

  it('will return the validator from getValidator', async () => {
    // @ts-ignore
    expect(constructor.getValidator('required')).to.equal(alwaysRequiredValidator);
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

  it('will set touched on focus', async () => {
    el.dispatchEvent(new Event('focus'));
    await elementUpdated(el as unknown as Element);
    expect(el.touched).to.be.true;
  });

  it('will set focused until blur', async () => {
    el.dispatchEvent(new Event('focus'));
    await elementUpdated(el as unknown as Element);
    expect(el.focused).to.be.true;
    el.dispatchEvent(new Event('blur'));
    await elementUpdated(el as unknown as Element);
    expect(el.focused).to.be.false;
  });
});
