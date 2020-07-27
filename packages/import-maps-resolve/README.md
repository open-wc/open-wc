# Resolve import-maps

Library for parsing and resolving [import maps](https://github.com/WICG/import-maps).

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

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

The `parseFromString` parses an import map from a JSON string. It returns the parsed import map object to be used when resolving import specifiers.

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

const importMap = parse(importMapString, baseURL);
```

### Resolving specifiers

Once you've created a parsed import map, you can start resolving specifiers. The `resolve` function returns a `URL`, you can use this to either use the resolved `href` or just the `pathname`.

```js
import { resolve } from '@import-maps/resolve';

const importMap = /* parse import map shown above */;
// create a base URL to resolve imports relatively to
const baseURL = new URL('https://www.example.com/');

const resolvedUrl = resolve(importMapString, baseURL);

// the full url including protocol and domain
console.log(resolvedUrl.href);
// just the path
console.log(resolvedUrl.url);
```

If you need to use the resolved path on the file system, you can use the `fileURLToPath` utility:

```js
import { fileURLToPath } from 'url';
import { resolve } from '@import-maps/resolve';

const resolvedUrl = resolve(importMapString, baseURL);

// the fully resolved file path
console.log(fileURLToPath(resolvedUrl));
```

## Acknowledgments

This implementation is heavily based on the [import-maps reference implementation](https://github.com/WICG/import-maps/tree/master/reference-implementation).
