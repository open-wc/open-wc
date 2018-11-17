interface ShadyCSS {
  nativeCss: boolean;
  nativeShadow: boolean;
  styleElement(host: Element, overrideProps?: {[key: string]: string}): void;
  prepareTemplateDom(template: Element, elementName: string): void;
  prepareTemplateStyles(
      template: Element, elementName: string, typeExtension?: string): void;
  getComputedStyleValue(template: Element, property: string): void;
}

interface ShadyDOM {
  inUse: boolean;
}

interface Window2 extends Window {
  ShadyCSS?: ShadyCSS;
  ShadyDOM?: ShadyDOM;
}

/** Allows code to check `instanceof ShadowRoot`. */
declare interface ShadowRootConstructor {
  new(): ShadowRoot;
}
export declare const ShadowRoot: ShadowRootConstructor;

export const stripExpressionDelimiters = (html: string) => html.replace(/<!---->/g, '');

export const nextFrame = () => new Promise(yay => window.requestAnimationFrame(yay));

export const getComputedStyleValue = (element: Element, property: string) =>
  (window as Window2).ShadyCSS
    ? (window as Window2)!.ShadyCSS!.getComputedStyleValue(element, property)
    : window.getComputedStyle(element).getPropertyValue(property);