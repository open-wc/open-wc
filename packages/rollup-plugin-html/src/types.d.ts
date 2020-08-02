import { OutputChunk, OutputOptions, OutputBundle, Plugin } from 'rollup';

export interface HtmlFile {
  html?: string;
  name?: string;
  rootDir?: string;
  inputModuleIds?: string[];
  htmlFileName?: string;
  inlineModules?: Map<string, string>;
}

export interface PluginOptions {
  name?: string;
  files?: string | string[];
  flatten?: boolean;
  html?: string | HtmlFile[];
  outputBundleName?: string;
  rootDir?: string;
  publicPath?: string;
  inject?: boolean;
  minify?: boolean | object | MinifyFunction;
  template?: string | TemplateFunction;
  transform?: TransformFunction | TransformFunction[];
  /** @deprecated use html instead */
  inputHtml?: string;
  /** @deprecated use files instead */
  inputPath?: string;
  htmlFileName?: string;
}

export type MinifyFunction = (html: string) => string | Promise<string>;

export interface GeneratedBundle {
  name: string;
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
  html?: string;
  /** @deprecated use html instead */
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
  bundles: Record<string, EntrypointBundle>;
}

export interface TransformArgs {
  // see TemplateArgs
  bundle: EntrypointBundle;
  // see TemplateArgs
  bundles: Record<string, EntrypointBundle>;
  htmlFileName: string;
}

export type TransformFunction = (html: string, args: TransformArgs) => string | Promise<string>;

export type TemplateFunction = (args: TemplateArgs) => string | Promise<string>;

export interface RollupPluginHtml extends Plugin {
  /** @deprecated use getHtmlFileNames instead */
  getHtmlFileName(): string | undefined;
  getHtmlFileNames(): string[] | undefined;
  addHtmlTransformer(transform: TransformFunction): void;
  addOutput(name: string): Plugin;
}
