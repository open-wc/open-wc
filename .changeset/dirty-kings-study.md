---
'@open-wc/testing-helpers': minor
'@open-wc/testing': minor
---

Undo deprecation of the `html` and `unsafeStatic` exports to enable matching lit versions to what is used in fixture.

A typical testing file looks like this

```js
import { html, fixture } from '@open-wc/testing'; // html will be lit-html 2.x

it('works for tags', async () => {
  const el = await fixture(html`<my-el></my-el>`);
});
```

With this export you can combine the usage of lit-html 2.x for the fixture and template rendering in lit-html 1.x

```js
import { html as fixtureHtml, fixture } from '@open-wc/testing'; // fixtureHtml will be lit-html 2.x
import { html } from 'my-library'; // html will be lit-html 1.x

it('works for tags', async () => {
  const el = await fixture(fixtureHtml`<my-el></my-el>`);
});

it('can be combined', async () => {
  class MyExtension extends LibraryComponent {
    render() {
      // needs to be lit-html 1.x as the library component is using LitElement with lit-html 1.x
      return html`<p>...</p>`;
    }
  }

  // fixture requires a lit-html 2.x template
  const el = await fixture(fixtureHtml`<my-el></my-el>`);
});
```

NOTE: If you are using fixture for testing your lit-html 1.x directives then this will no longer work.
A possible workaround for this is

```js
import { html, fixture } from '@open-wc/testing'; // html will be lit-html 2.x
import { render, html as html1, fancyDirective } from 'my-library'; // html and render will be lit-html 1.x

it('is a workaround for directives', async () => {
  const node = document.createElement('div');
  render(html1`<p>Testing ${fancyDirective('output')}</p>`, node);

  // you can either cleanup yourself or use fixture
  const el = await fixture(html`${node}`);

  expect(el.children[0].innerHTML).toBe('Testing [[output]]');
});
```
