# Component >> Knowledge >> Attribute Property Mismatch ||30

> This text is not yet written or polished - care to help?

Many elements reflect their properties as attributes, and vice versa, like for example the `disabled` attribute on a button.

```html
<button disabled></button>
```

```js
console.log(myButton.disabled); // true
console.log(myButton.hasAttribute('disabled')); // true
```

If we set the property to false, it'll _reflect_ it to an attribute. (In this case, because it's a boolean attribute, it'll be omitted)

```js
myButton.disabled = false;
console.log(myButton.hasAttribute('disabled')); // false
```

This concept is called attribute reflection.

However, this is not true for the `checked` attribute on an input element of type checkbox. The `checked` property on the input element does not reflect to an attribute, and should only be relied on to set an initial state. Consider the following example:

```html
<input id="mycheck" type="checkbox" checked></input>
```

It will only set the property the first time:

```js
console.log(mycheck.checked); // true
```

Removing the `checked` attribute does not change the `checked` _property_.

```js
mycheck.removeAttribute('checked');
console.log(mycheck.checked); // true
```

And similarly, changing the `checked` property does not change the attribute:

```js
mycheck.checked = false;
console.log(mycheck.hasAttribute('checked')); // true
console.log(mycheck.checked); // false
```
