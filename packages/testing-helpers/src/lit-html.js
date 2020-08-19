import { html as litHtml } from 'lit-html/lit-html.js';

export { render } from 'lit-html/lit-html.js';

/**
 * This is a wrapper around lit-html that supports dynamic strings to be added as a preprocessing
 * step, before a template is passed to lit's html function.
 * A dynamic string will be evaluated one time (on init) and passed to lit-html as being
 * part of the static string.
 *
 * WARNING: do not use in production!!! has a huge performance penalty as every string is
 * different from lit-htmls perspective so a new tag is created every time.
 *
 * A valid use case for this would be to create dynamic tag names.
 *
 * @example:
 * const tag = unsafeStatic('my-tag');
 * html`<${tag} prop="${prop}"></${tag>`
 * // will in turn calls lit-html html function as:
 * html`<my-tag prop="${prop}"></my-tag>`
 *
 * @param {TemplateStringsArray} strings Static Parts
 * @param {Array.<any>} values Dynamic Parts
 * @returns {import('lit-html').TemplateResult}
 */
export function html(strings, ...values) {
  const newVal = []; // result values to be passed on to lit-html
  const newStr = []; // result strings to be passed on to lit-html

  if (values.length === 0) {
    return litHtml(strings, ...values);
  }

  const isDynamicProp = p => p && p.d && typeof p.d === 'string' && Object.keys(p).length === 1;
  const addToCurrentString = add => {
    newStr[newStr.length - 1] = newStr[newStr.length - 1] + add;
  };

  // Create the result arrays
  values.forEach((string, index) => {
    if (index === 0) {
      newStr.push(strings[0]); // this is either ''(if tagged starts with value) or string
    }
    // Situation 1 : dynamic string
    const p = values[index]; // potential dynamic string
    if (isDynamicProp(p)) {
      addToCurrentString(p.d);
      addToCurrentString(strings[index + 1]);
    } else {
      // Situation 2: no dynamic string, just push string and value
      newVal.push(p); // a 'real' value
      newStr.push(strings[index + 1]);
    }
  });
  // Return lit template
  // TODO: this is the reason it's not performant TemplateStringsArray needs to be always exactly
  //   the same => e.g. would require specific caching
  // @ts-ignore
  return litHtml(newStr, ...newVal);
}

export function unsafeStatic(options) {
  return {
    d: options,
  };
}
