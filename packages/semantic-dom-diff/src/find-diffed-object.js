import { isParentNode, isElement } from './parse5-utils';

/**
 * @param {ASTNode | ASTNode[]} root
 * @param {string[]} path
 */
export function findDiffedObject(root, path) {
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
    } else if (step === 'attrs') {
      if (isElement(node)) {
        node = node.attrs;
      } else {
        throw new Error('Cannot read attributes from non-element node.');
      }
    } else {
      // For all other steps we don't walk further
      break;
    }
  }

  return node;
}
