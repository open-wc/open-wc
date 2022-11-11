# Resolve import-maps

Library for parsing and resolving [import maps](https://github.com/WICG/import-maps).

## Usage

```bash
npm i --save-dev @import-maps/resolve
```

### Base URL

Parsing and resolving import maps requires a base URL. This is an instance of the `URL` constructor.

This can be a browser URL:

```js
const myUrl = new URL('https://www.example.com/');
```

Or a file URL when working with a file system. The `pathToFileURL` function is useful for converting a file path to a URL object:

```js
import path from 'path';
import { pathToFileURL } from 'url';

const fileUrl1 = new URL('file:///foo/bar');
const fileUrl2 = pathToFileURL(path.join(process.cwd(), 'foo', 'bar'));
```

### Parsing an import map from a string

The `parseFromString` function parses an import map from a JSON string. It returns the parsed import map object to be used when resolving import specifiers.

```js
import { parseFromString } from '@import-maps/resolve';

// get the import map from somewhere, for example read it from a string
const importMapString = '{ "imports": { "foo": "./bar.js" } }';
// create a base URL to resolve imports relatively to
const baseURL = new URL('https://www.example.com/');

const importMap = parseFromString(importMapString, baseURL);
```

### Parsing an import map from an object

If you already have an object which represents the import map, it still needs to be parsed to validate it and to prepare it for resolving. You can use the `parse` function for this.

```js
import { parse } from '@import-maps/resolve';

// get the import map from somewhere, for example read it from a string
const rawImportMap = { imports: { foo: './bar.js' } };
// create a base URL to resolve imports relatively to
const baseURL = new URL('https://www.example.com/');

const importMap = parse(rawImportMap, baseURL);
```

### Resolving imports

Once you've created a parsed import map, you can start resolving specifiers. The `resolve` function returns an object with the resolved URL as well as a boolean whether the import was matched. When a bare import is not found in the import map, resolve returns null. When a relative import isn't found, the resolved URL is returned, and matched will be set to false.

```js
import { resolve } from '@import-maps/resolve';

const importMapString = '{ "imports": { "foo": "./bar.js" } }';
const baseURL = new URL('https://www.example.com/');
const importMap = parseFromString(importMapString, baseURL);

const scriptUrl = new URL('https://www.example.com/my-app.js');

// resolvedImport: https://www.example.com/bar.js, matched: true
const { resolvedImport, matched } = resolve('foo', baseURL, scriptUrl);

// resolvedImport: https://www.example.com/x.js, matched: false
const { resolvedImport, matched } = resolve('./x.js', baseURL, scriptUrl);

// resolvedImport: null, matched: false
const { resolvedImport, matched } = resolve('bar', baseURL, scriptUrl);
```

If you need to use the resolved path on the file system, you can use the `fileURLToPath` utility:

```js
import { fileURLToPath } from 'url';
import { resolve } from '@import-maps/resolve';

const { resolvedImport } = resolve(importMapString, baseURL, scriptUrl);

// the fully resolved file path
console.log(fileURLToPath(resolvedImport));
```

## Acknowledgments

This implementation is heavily based on the [import-maps reference implementation](https://github.com/WICG/import-maps/tree/master/reference-implementation).
