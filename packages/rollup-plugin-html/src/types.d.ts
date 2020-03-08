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

export interface InputHtmlData {
  name: string;
  rootDir: string;
  inputHtml: string;
}
