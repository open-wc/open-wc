# Knowledge >> Attributes and properties ||30

The difference between attributes and properties is a common source of confusion for developers.

## Attributes

Attributes are key value pairs defined in HTML on an element:

```html
<div id="myDiv" foo="bar"></div>
```

This attribute is available in javascript using dedicated APIs:

```js
const myDiv = document.getElementById('myDiv');

console.log(myDiv.attributes);
console.log(myDiv.getAttribute('foo'));
console.log(myDiv.hasAttribute('foo'));
```

Attributes can also be set from javascript, and will update the attribute in the DOM:

```js
myDiv.getAttribute('foo', 'not-bar');
```

```html
<div id="myDiv" foo="not-bar"></div>
```

Because HTML is string-based, attributes can only be strings.

## Properties

Properties are key-value pairs defined on a javascript object.

```js
const myObject = {};
// a property is set
myObject.foo = 'bar';
```

Because DOM elements are also exposed in javascript as objects, it's possible to set properties on DOM elements as well:

```js
const myDiv = document.getElementById('myDiv');

myDiv.foo = 'bar';
```

A great benefit of properties is that they can accept any javascript value, including complex objects and arrays.

## Templating

Most templating systems allow setting properties. For example in `lit-html` there is different syntax for setting an attribute or a property:

```js
// set an attribute
const foo = 'bar';
html`<my-element foo="${foo}"></my-element>`;
// set a property
html`<my-element .foo="${foo}"></my-element>`;
```

`preact` does some detection to see if a property exists on the element, and will set the property instead of the attribute.

## When to use what

Attributes have the benefit of being able to be set declaratively via plain HTML. It's a good practice to support this in your web components as well.

Properties are easier to access from javascript and are generally faster to update since they don't trigger a change to the DOM. It also supports setting complex objects.

As a general rule of thumb we recommend the following:

- Set properties when working with JS
- Set attributes when working with just HTML
- Sync attribute changes to the corresponding JS property
- Don't sync property changes to the corresponding HTML attribute

Many web component libraries allow you to configure this syncing behavior and set you up with a good default.

## Boolean attributes

HTML attributes are always strings. Boolean attributes are a convention where they are considered to be true when the attribute is present on an element, no matter the actual value.

```html
<button disabled></button>
<button disabled=""></button>
<button disabled="true"></button>
```

Interestingly, it's not possible to set a boolean attribute to false:

```html
<!-- disabled will still be true -->
<button disabled="false"></button>
```

## Attribute and property reflection

Many native elements reflect their properties as attributes, and vice versa, like for example the `type` attribute on an input.

```html
<input type="text" />
```

```js
console.log(myInput.type); // text
console.log(myInput.getAttribute('type')); // text
```

If we change the type attribute to `number`, it will be synced with the property:

```js
myButton.setAttribute('type', 'number');
console.log(myInput.type); // number
```

If we set the property to `date`, it will be synced with the attribute:

```js
myButton.type = 'date';
console.log(myButton.getAttribute('type')); // date
```

This concept is called attribute reflection. Most native attributes are synced to the javascript object, but not all native properties are reflected up to attributes.

We recommend reflecting from an attribute to a property, but to avoid reflecting from properties to attributes. This is because with custom elements properties can update often and triggering a DOM change for each update can impact performance.

### Special cases

The `checked` attribute on an input element of type checkbox is a special case. The `checked` property on the input element does not reflect to an attribute, and should only be relied on to set an initial state. Consider the following example:

```html
<input id="mycheck" type="checkbox" checked />
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

When using lit-html, we can get around this by always setting the property instead of the attribute:

```js
html`<input type="checkbox" .checked=${this.checkboxChecked} />`;
```
