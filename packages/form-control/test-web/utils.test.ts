import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { spy } from 'sinon';
import { formValues, parseFormAsObject, submit } from '../src/utils';

describe('The implicit submit function', () => {
  let form: HTMLFormElement;

  beforeEach(async () => {
    form = await fixture(html`<form>
      <input name="foo">
    </form>`) as unknown as HTMLFormElement;

    form.submit = function() {
      form.submitted = true;
    }
  });

  afterEach(fixtureCleanup);

  it('calls reportValidity', async () => {
    const reportValiditySpy = spy(form, 'reportValidity');
    submit(form);
    expect(reportValiditySpy.called).to.be.true;
    expect(form.submitted).to.be.true;
  });

  it('emits a submit event', async () => {
    const dispatchEventSpy = spy(form, 'dispatchEvent');
    const submitEvent = new Event('submit', {
      cancelable: true
    });
    submit(form);
    expect(dispatchEventSpy.calledWith(submitEvent));
    expect(form.submitted).to.be.true;
  });

  it('will not proceed if the form is invalid', async () => {
    const reportValiditySpy = spy(form, 'reportValidity');
    const dispatchEventSpy = spy(form, 'dispatchEvent');
    form.querySelector('input').required = true;
    submit(form);
    expect(reportValiditySpy.called).to.be.true;
    expect(dispatchEventSpy.called).to.be.false;
  });

  it('will not submit if event is prevented', async () => {
    const prevent = (event: Event) => event.preventDefault();
    form.addEventListener('submit', prevent);
    submit(form);
    expect(form.submitted).to.equal(undefined);
    form.removeEventListener('submit', prevent);
  });
});


describe('The formValues utility', () => {
  let form: HTMLFormElement;

  beforeEach(async () => {
    form = await fixture(html`<form>
      <input type="text" name="project" value="form-utils">
      <input type="checkbox" name="isCool" value="open-wc" checked>
      <input type="checkbox" name="isCool" value="web components" checked>
      <input type="checkbox" name="isCool" value="stubbed toes">
      <input type="checkbox" name="isCool" value="the platform" checked>
    </form>`) as unknown as HTMLFormElement;
  });

  afterEach(fixtureCleanup);

  it('will return an object with single property keys', async () => {
    const values = formValues(form);
    expect(values.project).to.equal('form-utils');
  });

  it('will return an object with a list of property keys', async () => {
    const values = formValues(form);

    expect(values.isCool).to.deep.equal([
      'open-wc', 'web components', 'the platform'
    ]);
  });
});


describe('The parseFormAsObject utility', () => {
  let form: HTMLFormElement;
  let parsed: Record<any, any>;

  beforeEach(async () => {
    form = await fixture(html`<form>
      <input name="name.first" value="Alice">
      <input name="name.last" value="Blue">
      <input name="occupation" value="developer">
      <input name="contact.phone" value="555-867-5309">
      <input name="contact.email" value="alice.blue@company.com">
      <input type="checkbox" name="contact.preferred" value="phone" checked>
      <input type="checkbox" name="contact.preferred" value="email" checked>
      <input type="checkbox" name="contact.preferred" value="carrier pigeon">
      <input name="contact.other.method" value="slack">
    </form>`) as unknown as HTMLFormElement;
    parsed = parseFormAsObject(form);
  });

  afterEach(fixtureCleanup);

  it('will grab top-level values', async () => {
    expect(parsed.occupation).to.equal('developer');
  });

  it('will parse nested objects', async () => {
    expect(parsed.name.first).to.equal('Alice');
    expect(parsed.name.last).to.equal('Blue');
  });

  it('will parse past one level', async () => {
    expect(parsed.contact.other.method).to.equal('slack');
  });
});
