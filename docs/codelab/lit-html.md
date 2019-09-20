# Lit-html

## Declarative

```js
function myTemplate(message, selected) {
    return html`
        <p class="${selected ? 'selected' : 'not-selected'}">
            Hello ${message}
        </p>

        <button @click=${() => console.log('Updated!')}>
            Update
        </button>
    `;
}
```

## Composable

```js
import { footerTemplate } from './footer.js';

function bodyTemplate(message) {
    return html`
        <p>Hello ${message}</p>
    `;
}

const headerTemplate = html`
    <h1>Composed template</h1>
`;

const composedTemplate = html`
    ${headerTemplate}
    ${bodyTemplate('World')}
    ${footerTemplate}
`;
```

## Syntax sugar

Syntax sugar for calling a function

```js
const href = '/foo/bar';
const message = 'world';

const template = html`
    <a href="${href}">
        Hello ${message}
    </a>
`;
```

Is the same as:

```js
const href = '/foo/bar';
const message = 'world';

html(['<a href="', '">Hello ', "</a>"], href, message);
```