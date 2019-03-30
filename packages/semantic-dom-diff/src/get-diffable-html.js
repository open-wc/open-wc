const NODES_IGNORE_CHILDREN = ['script', 'style', 'svg'];

export default function getDiffableHTML(html) {
  let text = '';
  let depth = -1;
  /** @type {Set<Node>} */
  const processedChildren = new Set();
  /** @type {Set<Node>} */
  const printedOpen = new Set();

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
    return (
      NODES_IGNORE_CHILDREN.includes(node.nodeName.toLowerCase()) || processedChildren.has(node)
    );
  }

  /**
   * @param {Element} el
   * @param {Attr} attr
   */
  function getAttributeString(el, attr) {
    if (attr.name === 'class') {
      const sortedClasses = [...el.classList.values()].sort().join(' ');
      return ` class="${sortedClasses}"`;
    }
    return ` ${attr.name}="${attr.value}"`;
  }

  /** @param {Element} el */
  function getAttributesString(el) {
    let attrStr = '';
    const attributes = [...el.attributes].sort((a, b) => a.name.localeCompare(b.name));
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
    if (el.localName === 'diff-container') {
      return;
    }

    text += `${getIndentation()}<${el.localName}${getAttributesString(el)}>\n`;
    printedOpen.add(el);
  }

  /** @param {Node} node */
  function printStart(node) {
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
    if (el.localName === 'diff-container') {
      return;
    }

    text += `${getIndentation()}</${el.localName}>\n`;
  }

  /** @param {Node} node */
  function printEnd(node) {
    if (node instanceof Element) {
      printCloseElement(node);
    }
  }

  const container = document.createElement('diff-container');
  container.innerHTML = html;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT + NodeFilter.SHOW_ELEMENT,
  );
  while (walker.currentNode) {
    const current = walker.currentNode;
    if (!printedOpen.has(current)) {
      printStart(current);
    }

    if (!shouldProcessChildren(current) && walker.firstChild()) {
      depth += 1;
    } else {
      printEnd(current);
      if (!walker.nextSibling()) {
        depth -= 1;

        if (!walker.parentNode()) {
          break;
        }
        processedChildren.add(walker.currentNode);
      }
    }
  }

  return text;
}
