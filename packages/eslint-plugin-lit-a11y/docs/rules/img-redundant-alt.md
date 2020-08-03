# Enforce img alt attribute does not contain the word image, picture, or photo. (img-redundant-alt)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<img src="foo" alt="Photo of foo being weird." />`;
html`<img src="foo" alt="Image of me at a bar!" />`;
html`<img src="foo" alt="Picture of baz fixing a bug." />`;
```

Examples of **correct** code for this rule:

```js
html`<img src="foo" alt="Foo eating a sandwich." />`;
html`<img src="bar" aria-hidden alt="Picture of me taking a photo of an image" />`; // Will pass because it is hidden.
html`<img src="baz" alt=${`Baz taking a ${photo}`} />`; // This is valid since photo is a variable name.`
```

### Options

You can also specify additional keywords to fail on. Example:

```js
{
  keywords: ['foo'];
}
```

Will make the following fail:

```js
html`<img alt="foo" />`;
```

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
