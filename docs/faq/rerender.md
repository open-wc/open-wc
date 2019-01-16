# Rerender not triggered

# Modifying an array or objects members does not trigger rerender

Imagine the following scenario: you've created a custom element that observes an `items` property:
```js
class MyEl extends LitElement {
  render() {/*...*/}
  static get properties() {
    return {
      items: { type: Array }
    }
  }
}
```

You might think that changing *one of* the items should trigger a rerender:
```js
const myEl = document.querySelector('my-el');
myEl.items; // [{ name: 'foo' }, { name: 'bar' }]
myEl.items[0].name = 'baz';
```

But this won't cause the element to update. Why not?

### Reference Values
Javascript has two kinds of types: direct values and reference values. Direct values are things like `'a string'` or `1` or `true`. Their value flows directly from what they are, and there's no ambiguity - the number 1 is always and simply the number 1.
Reference values like `Object` and `Array` are like containers for multiple direct (or reference) values. An array for instance can contain multiple values at any numeric index.

In the case of direct values, equality is determined by directly comparing the value: 
```js
1 === 1 // true
'three' === 'three' // true
```

But in the case of reference types, the thing that is compared is the *reference* to the object, not its contents. 
```js
const o = { foo: 'bar' }
const p === { foo: 'bar' }
o === p // false
```

### LitElement's Property System
LitElement's property system only observes changes to the reference. Recursively listening for changes to child properties would be prohibitively expensive, especially for large nested objects.

Therefore, setting a child or grandchild property of `myEl.items` will *not* trigger a render.

So what can we do if we need to update a nested child? Immutable data patterns can help us.

```js
const [oldItem, ...rest] = myEl.items;
const newItem = { name: 'baz' };
myEl.items = [
  newItem,
  ...rest,
];
```

For objects, the syntax is even simpler:

```js
// example of updating the `changed` property on `myEl.objectProperty`
myEl.objectProperty = {
  ...myEl.objectProperty,
  changed: newVal
};
```

### Summary
Polymer slack user Dracco adds:

> Actually it's not about JS, every objective language can have a collection structure, but modifying the collection does not modify the object.  
> Comparing in JS means comparing references (it would be impossible to make a universal and fast content comparison), so pushing things to an array keeps the reference the same (as it is still the same instance of an Array class) -  just the contents change.  
> Similarly in `class Person { constructor() { this.isBanned = false; } }`, if you create a new instance (`const p = new Person();`) and then modify the property (`p.isBanned = true;`), it is still the same instance it was before, just the property differs.  

-- <cite>Dracco</cite>
