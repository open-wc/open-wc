# Rollup Plugin HTML

Plugin for generating HTML files from rollup.

- Generate one or more HTML pages from a rollup build
- Inject rollup bundle into an HTML page
- Optionally use HTML as rollup input, bundling any module scripts inside
- Minify HTML and inline JS and CSS
- Suitable for single page and multi-page apps

Jump to:

- [Installation](#installation)
- [Examples](#examples)
- [Configuration options](#configuration-options)
- [Configuration types](#configuration-types)

## Installation

```bash
npm i -D @open-wc/rollup-plugin-html
```

## Examples

### Simple HTML page

When used without any options, the plugin will inject your rollup bundle into a basic HTML page. Useful for developing a simple application.

<details>

<summary>Show example</summary>

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  input: './my-app.js',
  output: { dir: 'dist' },
  plugins: [html()],
};
```

</details>

### Input from file

During development, you will already have an HTML file which imports your application's modules. You can use give this same file to the plugin using the `inputPath` option, which will bundle any modules inside and output the same HTML minified optimized.

<details>

<summary>Show example</summary>

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      inputPath: 'index.html',
    }),
  ],
};
```

</details>

### Input from string

Sometimes the HTML you want to use as input is not available on the file system. With the `inputHtml` option you can provide the HTML as a string directly. This is useful for example when using rollup from javascript directly.

<details>

<summary>Show example</summary>

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      inputHtml: '<html><script type="module" src="./app.js></script></html>',
    }),
  ],
};
```

</details>

### Template

With the `template` option, you can let the plugin know where to inject the rollup build into. This option can be a string or an (async) function which returns a string.

<details>

<summary>Show example</summary>

Template as a string:

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      template: `
      <html>
        <head><title>My app</title></head>
        <body></body>
      </html>`,
    }),
  ],
};
```

Template as a function:

```js
import fs from 'fs';
import html from '@open-wc/rollup-plugin-html';

export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      template() {
        return new Promise((resolve) => {
          const indexPath = path.join(__dirname, 'index.html');
          fs.readFile(indexPath, 'utf-8', (err, data) => {
            resolve(data);
          });
        });
      }
    }
  ],
};
```

</details>

### Multiple HTML pages

With this plugin, you can generate as many HTML pages as you want. Rollup will efficiently create shared chunks between pages, allowing you to serve from cache between navigations.

<details>
 <summary>View example</summary>

The easiest way is to have the HTML files with module scripts on disk, for each one you can create an instance of the plugin which will bundle the different entry points automatically share common code.

By default, the output filename is taken from the input filename. If you want to create a specific directory structure you need to provide an explicit name:

```js
import html from '@open-wc/rollup-plugin-html';

export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      inputPath: './home.html',
    }),
    html({
      inputPath: './about.html',
    }),
    html({
      name: 'articles/a.html',
      inputPath: './articles/a.html',
    }),
    html({
      name: 'articles/b.html',
      inputPath: './articles/b.html',
    }),
    html({
      name: 'articles/c.html',
      inputPath: './articles/c.html',
    }),
  ],
};
```

</details>

### Manually inject build output

If you want to control how the build output is injected on the page, disable the `inject` option and use the arguments provided to the template function.

<details>

<summary>Show example</summary>

With a regular template function:

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  input: './app.js',
  output: { dir: 'dist' },
  plugins: [
    html({
      name: 'index.html',
      inject: false,
      template({ bundle }) {
        return `
        <html>
          <head>
            ${bundle.entrypoints.map(bundle => e =>
              `<script type="module" src="${e.importPath}"></script>`,
            )}
          </head>
        </html>
      `;
      },
    }),
  ],
};
```

When one of the input options is used, the input html is available in the template function. You can use this to inject the bundle into your existing HTML page:

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  input: './app.js',
  output: { dir: 'dist' },
  plugins: [
    html({
      inputPath: './index.html',
      inject: false,
      template({ inputHtml, bundle }) {
        return inputHtml.replace(
          '</body>',
          `<script type="module" src="${bundle[0].entrypoints[0].importPath}"></script></body>`,
        );
      },
    }),
  ],
};
```

</details>

### Transform output HTML

You can use the `transform` option to manipulate the output HTML before it's written to disk. This is useful for setting meta tags or environment variables based on input from other sources.

`transform` can be a single function or an array. This makes it easy to compose transformations.

<details>
  <summary>View example</summary>

Inject language attribute:

```js
import html from '@open-wc/rollup-plugin-html';
export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      inputPath: './index.html',
      transform: html => html.replace('<html>', '<html lang="en-GB">'),
    }),
  ],
};
```

Inject language attributes and environment variables:

```js
import html from '@open-wc/rollup-plugin-html';
import packageJson from './package.json';

const watchMode = process.env.ROLLUP_WATCH === 'true';

export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      inputPath: './index.html',
      transform: [
        html => html.replace('<html>', '<html lang="en-GB">'),
        html =>
          html.replace(
            '<head>',
            `<head>
              <script>
                window.ENVIRONMENT = "${watchMode ? 'DEVELOPMENT' : 'PRODUCTION'}";
                window.APP_VERSION = "${packageJson.version}";
              </script>`,
          ),
      ],
    }),
  ],
};
```

</details>

### Public path

By default, all imports are made relative to the HTML file and expect files to be in the rollup output directory. With the `publicPath` option you can modify where files from the HTML file are requested from.

<details>
  <summary>View example</summary>

```js
import html from '@open-wc/rollup-plugin-html';

export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      inputPath: './index.html',
      publicPath: '/static/',
    }),
  ],
};
```

</details>

### Multiple build outputs

It is possible to create multiple rollup build outputs and inject both bundles into the same HTML file. This way you can ship multiple bundles to your users, and load the most optimal version for the user's browser.

<details>
<summary>View example</summary>

To create multiple outputs with rollup, you need to set the `output` option as an array. For each output, you need to create a child plugin from the main plugin.

The HTML file will be output into the directory of the last build. If your builds will be output into separate directories, you need to make sure the modern build is last.

```js
import html from '@open-wc/rollup-plugin-html';

const htmlPlugin = html({
  name: 'index.html',
  inject: false,
  template({ bundles }) {
    return `
      <html>
        <body>
        <script nomodule src="./systemjs.js"></script>
        ${bundles[0].entrypoints.map(
          e => `<script nomodule>System.import("${e.importPath}")</script>`,
        )}

        ${bundles[1].entrypoints.map(
          e => `
          <script type="module" src="${e.importPath}"></script>
        `,
        )}
        </body>
      </html>
    `;
  },
});

export default {
  input: './app.js',
  output: [
    {
      format: 'system',
      dir: 'dist/legacy',
      plugins: [htmlPlugin.addOutput()],
    },
    // Note: the modern build should always be last, as the HTML file will be output into
    // this directory
    {
      format: 'es',
      dir: 'dist',
      plugins: [htmlPlugin.addOutput()],
    },
  ],
  plugins: [htmlPlugin],
};
```

</details>

## Configuration options

All configuration options are optional if an option is not set the plugin will fall back to smart defaults. See below example use cases.

### name

Type: `string`

Name of the generated HTML file. If `inputPath` is set, defaults to the `inputPath` filename, otherwise defaults to `index.html`.

### inputPath

Type: `string`

Path to the HTML file to use as input. Modules in this file are bundled and the HTML is used as the template for the generated HTML file.

### inputHtml

Type: `string`

Same as `inputPath`, but provides the HTML as a string directly.

### dir

Type: `string`

The directory to output the HTML file into. This defaults to the main output directory of your rollup build. If your build has multiple outputs in different directories, this defaults to the lowest directory on the file system.

### publicPath

Type: `string`

The public path where static resources are hosted. Any file requests (CSS, js, etc.) from the index.html will be prefixed with the public path.

### inject

Type: `boolean`

Whether to inject the rollup bundle into the output HTML. If using one of the input options, only the bundled modules in the HTML file are injected. Otherwise, all rollup bundles are injected. Default true. Set this to false if you need to apply some custom logic to how the bundle is injected.

### minify

Type: `boolean | object | (html: string) => string | Promise<string>`

When false, does not do any minification. When true, does minification with default settings. When an object, does minification with a custom config. When a function, the function is called with the html and should return the minified html. Defaults to true.

Default minification is done using [html-minifier](https://github.com/kangax/html-minifier). When passing an object, the object is given to `html-minifier` directly so you can use any of the regular minify options.

### template

Type: `string | (args: TemplateArgs) => string | Promise<string>`

Template to inject js bundle into. It can be a string or an (async) function. If an input is set, that is used as the default output template. Otherwise defaults to a simple html file.

For more info see the [configuration type definitions](#configuration-types).

### transform

Type: `TransformFunction | TransformFunction[]`

TransformFunction: `(html: string, args: TransformArgs) => string | Promise<string>`

Function or array of functions that transform the final HTML output.

For more info see the [configuration type definitions](#configuration-types).

## Configuration types

<details>

<summary>Full typescript definitions of configuration options</summary>

```ts
import { OutputChunk, OutputOptions, OutputBundle } from 'rollup';

export interface PluginOptions {
  name?: string;
  inputPath?: string;
  inputHtml?: string;
  dir?: string;
  publicPath?: string;
  inject?: boolean;
  minify?: boolean | object | MinifyFunction;
  template?: string | TemplateFunction;
  transform?: TransformFunction | TransformFunction[];
}

export type MinifyFunction = (html: string) => string | Promise<string>;

export interface GeneratedBundle {
  options: OutputOptions;
  bundle: OutputBundle;
}

export interface EntrypointBundle extends GeneratedBundle {
  entrypoints: {
    // path to import the entrypoint, can be used in an import statement
    // or script tag directly
    importPath: string;
    // associated rollup chunk, useful if you need to get more information
    // about the chunk. See the rollup docs for type definitions
    chunk: OutputChunk;
  }[];
}

export interface TemplateArgs {
  // if one of the input options was set, this references the HTML set as input
  inputHtml?: string;
  // the rollup bundle to be injected on the page. if there are multiple
  // rollup output options, this will reference the first bundle
  //
  // if one of the input options was set, only the bundled module script contained
  // in the HTML input are available to be injected in both the bundle and bundles
  // options
  bundle: EntrypointBundle;
  // the rollup bundles to be injected on the page. if there is only one
  // build output options, this will be an array with one option
  bundles: EntrypointBundle[];
}

export interface TransformArgs {
  // see TemplateArgs
  bundle: EntrypointBundle;
  // see TemplateArgs
  bundles: EntrypointBundle[];
}

export type TransformFunction = (html: string, args: TransformArgs) => string | Promise<string>;

export type TemplateFunction = (args: TemplateArgs) => string | Promise<string>;
```

</details>
