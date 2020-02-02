declare module '@mdx-js/mdx' {
  function mdx(markdown: string, options: { compilers: any[]; filepath: string }): Promise<string>;
  export = mdx;
}

declare module '@mdx-js/mdx/mdx-hast-to-jsx' {
  export function toJSX(a: any, b: any, c: any): any;
}
