# Enforce emojis are wrapped in <span> and provide screenreader access. (accessible-emoji)

> Emoji help us communicate complex ideas very easily. When used in native apps and applications, emoji are reasonably accessible to screen readers, but on the web we need to do a little more to make sure everyone can understand emoji.

- [Léonie Watson](https://tink.uk/accessible-emoji/)

## Rule Details

This rule aims to prevent inaccessible use of emoji in lit-html templates.

Examples of **incorrect** code for this rule:

```js
html` <span>🐼</span> `;
```

```js
html` <i role="img" aria-label="Panda face">🐼</i> `;
```

Examples of **correct** code for this rule:

```js
html` <span role="img" aria-label="Panda face">🐼</span> `;
```

```js
html` <span role="img" alt="Panda face">🐼</span> `;
```

```js
html`
  <label id="label">Clown</label>
  <span role="img" aria-labelledby="label">🤡</span>
`;
```

## When Not To Use It

If you do not use emoji in your lit-html templates.

## Further Reading

[Accessible emoji by Léonie Watson](https://tink.uk/accessible-emoji/)
