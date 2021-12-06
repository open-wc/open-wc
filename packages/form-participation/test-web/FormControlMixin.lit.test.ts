import { elementUpdated, expect, fixture, fixtureCleanup } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { FormControlMixin, formValues } from '../src';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

@customElement('form-control-lit-no-validators')
class FormControlLitNoValidators extends FormControlMixin(LitElement) {
  @query('input')
  validationTarget: HTMLElement;

  render(): TemplateResult {
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
  let el: FormControlLitNoValidators;

  const getFormValues = () => {
    return formValues(form as unknown as HTMLFormElement);
  };

  beforeEach(async () => {
    form = await fixture(html`
      <form>
        <form-control-lit-no-validators
          name="formControl"
        ></form-control-lit-no-validators>
      </form>
    `);
    el = form.querySelector<FormControlLitNoValidators>('form-control-lit-no-validators');
  });

  afterEach(fixtureCleanup);

  it('does not register self with the form with no value', async () => {
    expect(
      formValues(form as unknown as HTMLFormElement).formControl
    ).to.equal(undefined);
  });

  it('will set the value on input', async () => {
    el.focus();
    el.validationTarget.focus();
    await sendKeys({ type: 'hello world' });
    await elementUpdated(form);
    expect(getFormValues().formControl).to.equal('hello world');
  });

  it('will set the value programmatically', async () => {
    el.value = 'foobar';
    await elementUpdated(form);
    expect(getFormValues().formControl).to.equal('foobar');
  });

  it('maintains a reference to the parent form', async () => {
    expect(el.form).to.equal(form);
  });

  it('will reset the value on form reset', async () => {
    el.value = 'hello world';
    await elementUpdated(form);
    expect(getFormValues().formControl).to.equal('hello world');
    (form as unknown as HTMLFormElement).reset();
    await elementUpdated(form);
    expect(getFormValues().formControl).to.equal('');
  });
});
