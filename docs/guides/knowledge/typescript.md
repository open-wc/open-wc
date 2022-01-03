# Knowledge >> Typescript ||10

Best practices for custom-elements in typescript

## Add Component to HTMLElementTagNameMap

Best practice is, if you resiter your component, you also add it to the HTMLElementTagNameMap

```typescript
declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent;
  }
}
```

so when you later cerate a instace via document.createElement, it is strongly typed.
