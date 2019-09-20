# Tagged template literals

Tagged template literals are blabla

```js
function html(staticValues, ...dynamicValues) {
    console.log(staticValues);
    console.log(dynamicValues);
}

const planet = 'earth';

const template = html`Hello ${planet}!`; 
// ["Hello ", "!"] <-- static values
// ["earth] <-- dynamic values
```