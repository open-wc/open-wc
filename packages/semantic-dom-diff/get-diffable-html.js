const DEFAULT_IGNORE_TAGS = ['script', 'style', 'svg'];
const DEFAULT_EMPTY_ATTRS = ['class', 'id'];
const VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

/**
 * @typedef IgnoreAttributesForTags
 * @property {string[]} tags tags on which to ignore the given attributes
 * @property {string[]} attributes attributes to ignore for the given tags
 */

/**
 * @typedef DiffOptions
 * @property {(string | IgnoreAttributesForTags)[]} [ignoreAttributes]
 *  array of attributes to ignore, when given a string that attribute will be ignored on all tags
 *  when given an object of type `IgnoreAttributesForTags`, you can specify on which tags to ignore which attributes
 * @property {string[]} [ignoreTags] array of tags to ignore, these tags are stripped from the output
 * @property {string[]} [ignoreChildren] array of tags whose children to ignore, the children of
 *   these tags are stripped from the output
 * @property {string[]} [stripEmptyAttributes] array of attributes which should be removed when empty.
 *   Be careful not to add any boolean attributes here (e.g. `hidden`) unless you know what you're doing
 */

/**
 * Restructures given HTML string, returning it in a format which can be used for comparison:
 * - whitespace and newlines are normalized
 * - tags and attributes are printed on individual lines
 * - comments, style, script and svg tags are removed
 * - additional tags and attributes can optionally be ignored
 *
 * See README.md for details.
 *
 * @example
 * import getDiffableHTML from '@open-wc/semantic-dom-diff';
 *
 * const htmlA = getDiffableHTML(`... some html ...`, { ignoredAttributes: [], ignoredTags: [], ignoreChildren: [] });
 * const htmlB = getDiffableHTML(`... some html ...`);
 *
 * // use regular string comparison to spot the differences
 * expect(htmlA).to.equal(htmlB);
 *
 * @param {Node | string} html
 * @param {DiffOptions} [options]
 * @returns {string} html restructured in a diffable format
 */
export function getDiffableHTML(html, options = {}) {
  const ignoreAttributes = /** @type {string[]} */ (options.ignoreAttributes
    ? options.ignoreAttributes.filter(e => typeof e === 'string')
    : []);
  const ignoreAttributesForTags = /** @type {IgnoreAttributesForTags[]} */ (options.ignoreAttributes
    ? options.ignoreAttributes.filter(e => typeof e !== 'string')
    : []);
  const ignoreTags = [...(options.ignoreTags || []), ...DEFAULT_IGNORE_TAGS];
  const ignoreChildren = options.ignoreChildren || [];
  const stripEmptyAttributes = options.stripEmptyAttributes || DEFAULT_EMPTY_ATTRS;

  let text = '';
  let depth = -1;
  /** @type {Set<Node>} */
  const handledChildrenForNode = new Set();
  /** @type {Set<Node>} */
  const handledNodeStarted = new Set();

  /** @returns {string} */
  function getIndentation() {
    return '  '.repeat(depth);
  }

  /** @param {Text} textNode */
  function printText(textNode) {
    const value = textNode.nodeValue.trim();

    if (value !== '') {
      text += `${getIndentation()}${value}\n`;
    }
  }

  /** @param {Node} node */
  function shouldProcessChildren(node) {
    const name = node.nodeName.toLowerCase();
    return (
      !ignoreTags.includes(name) &&
      !ignoreChildren.includes(name) &&
      !handledChildrenForNode.has(node)
    );
  }

  /**
   * An element's classList, sorted, as string
   * @param  {Element} el Element
   * @return {String}
   */
  function getClassListValueString(el) {
    // @ts-ignore
    return [...el.classList.values()].sort().join(' ');
  }

  /**
   * @param {Element} el
   * @param {Attr} attr
   */
  function getAttributeString(el, { name, value }) {
    const shouldStripAttr = stripEmptyAttributes.includes(name) && value === '';
    const isClassAttr = name === 'class';
    return (
      // eslint-disable-next-line no-nested-ternary
      shouldStripAttr
        ? ''
        : isClassAttr
        ? ` class="${getClassListValueString(el)}"`
        : ` ${name}="${value}"`
    );
  }

  /**
   * @param {Element} el
   * @param {Attr} attr
   */
  function isIgnoredAttribute(el, attr) {
    if (ignoreAttributes.includes(attr.name)) {
      return true;
    }

    return !!ignoreAttributesForTags.find(e => {
      if (!e.tags || !e.attributes) {
        throw new Error(
          `An object entry to ignoreAttributes should contain a 'tags' and an 'attributes' property.`,
        );
      }
      return e.tags.includes(el.nodeName.toLowerCase()) && e.attributes.includes(attr.name);
    });
  }

  const sortAttribute = (a, b) => a.name.localeCompare(b.name);

  /** @param {Element} el */
  function getAttributesString(el) {
    let attrStr = '';
    const attributes = Array.from(el.attributes)
      .filter(attr => !isIgnoredAttribute(el, attr))
      .sort(sortAttribute);

    if (attributes.length === 1) {
      attrStr = getAttributeString(el, attributes[0]);
    } else if (attributes.length > 1) {
      for (let i = 0; i < attributes.length; i += 1) {
        attrStr += `\n${getIndentation()} ${getAttributeString(el, attributes[i])}`;
      }
      attrStr += `\n${getIndentation()}`;
    }

    return attrStr;
  }

  /** @param {Element} el */
  function printOpenElement(el) {
    text += `${getIndentation()}<${el.localName}${getAttributesString(el)}>\n`;
  }

  /** @param {Node} node */
  function onNodeStart(node) {
    // don't print this node if we should ignore it
    if (node.nodeName === 'DIFF-CONTAINER' || ignoreTags.includes(node.nodeName.toLowerCase())) {
      return;
    }

    // don't print this node if it was already printed, this happens when
    // crawling upwards after handling children
    if (handledNodeStarted.has(node)) {
      return;
    }
    handledNodeStarted.add(node);

    if (node instanceof Text) {
      printText(node);
    } else if (node instanceof Element) {
      printOpenElement(node);
    } else {
      throw new Error(`Unknown node type: ${node}`);
    }
  }

  /** @param {Element} el */
  function printCloseElement(el) {
    if (el.localName === 'diff-container' || VOID_ELEMENTS.includes(el.localName)) {
      return;
    }

    text += `${getIndentation()}</${el.localName}>\n`;
  }

  /** @param {Node} node */
  function onNodeEnd(node) {
    // don't print this node if we should ignore it
    if (ignoreTags.includes(node.nodeName.toLowerCase())) {
      return;
    }

    if (node instanceof Element) {
      printCloseElement(node);
    }
  }

  let container;

  if (typeof html === 'string') {
    container = document.createElement('diff-container');
    container.innerHTML = html;
    depth = -1;
  } else if (html instanceof Node) {
    container = html;
    depth = 0;
  } else {
    throw new Error(`Cannot create diffable HTML from: ${html}`);
  }

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT + NodeFilter.SHOW_ELEMENT,
    null,
    false,
  );

  // walk the dom and create a diffable string representation
  while (walker.currentNode) {
    const current = walker.currentNode;
    onNodeStart(current);

    // crawl children if we should for this node, and if it has children
    if (shouldProcessChildren(current) && walker.firstChild()) {
      depth += 1;
    } else {
      // we are done processing this node's children, handle this node's end
      onNodeEnd(current);

      // move to next sibling
      const sibling = walker.nextSibling();

      // otherwise move back up to parent node
      if (!sibling) {
        depth -= 1;

        const parent = walker.parentNode();
        // if there is no parent node, we are done
        if (!parent) {
          break;
        }

        // we just processed the parent's children, remember so that we don't
        // process them again later
        handledChildrenForNode.add(parent);
      }
    }
  }

  return text;
}
