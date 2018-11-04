import { isParentNode, isElement } from './parse5-utils';

/**
 * @param {*} node The AST Node
 * @returns {string | null} the AST node name
 */
function getNodeName(node) {
  if (!isElement(node)) {
    return null;
  }

  if (node.attrs) {
    const idAttr = node.attrs.find(attr => attr.name === 'id');
    if (idAttr) {
      return `${node.nodeName}#${idAttr.value}`;
    }

    const classAttr = node.attrs.find(attr => attr.name === 'class');
    if (classAttr) {
      return `${node.nodeName}.${classAttr.value.split(' ').join('.')}`;
    }
  }

  return node.nodeName;
}

/**
 * @param {ASTNode | ASTNode[]} root the root to walk from
 * @param {string[]} path the full path to the dom element
 * @returns {string[]} the human readable path to a dom element
 */
export function getDiffPath(root, path) {
  const names = [];
  let node = root;

  for (let i = 0; i < path.length; i += 1) {
    const step = path[i];

    if (Array.isArray(node)) {
      const intStep = parseFloat(step);
      if (Number.isInteger(intStep)) {
        node = node[intStep];
      } else {
        throw new Error(`Non-integer step: ${step} for array node.`);
      }
    } else if (step === 'childNodes') {
      if (isParentNode(node)) {
        node = node.childNodes;
      } else {
        throw new Error('Cannot read childNodes from non-parent node.');
      }
    } else {
      // Break loop if we end up at a type of path section we don't want
      // walk further into
      break;
    }

    if (!Array.isArray(node)) {
      const name = getNodeName(node);
      if (name) {
        names.push(name);
      }
    }
  }

  return names.join(' > ');
}
