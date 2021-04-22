---
'@open-wc/lit-helpers': minor
---

Removes directives from package

- the `live` directive is in the official [lit](https://lit.dev/docs/templates/directives/#live) package.
- the `spread` and `spreadProps` directives no longer work with the updated directive API of `lit`. They will need to be recreated and we will do this in [lit-labs](https://github.com/lit/lit/tree/main/packages/labs).
- `import { /* ... */ } from '@open-wc/lit-helpers';` is not the only valid entrypoint
