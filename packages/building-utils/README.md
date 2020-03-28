# Building utils

Utils for `@open-wc` building packages. This is a private package, and should not
be depended on directly.

## `apply-sw-registration`

Takes a HTML string, uses `parse5` to transform it to an AST, queries the document body, and appends a minified service worker registration script to the end of the document body.

Example usage:

```js
const applyServiceWorkerRegistration = require('@open-wc/building-utils');

let htmlString = '<html><body></body></html>';
htmlString = applyServiceWorkerRegistration(htmlString);
```
