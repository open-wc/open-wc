// @ts-nocheck
/* eslint-disable */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const parse5 = require('parse5');
const treeAdapter = require('parse5-htmlparser2-tree-adapter');
const util_1 = require('./util');
const analyzerCache = new WeakMap();
/**
 * Analyzes a given template expression for traversing its contained
 * HTML tree.
 */
class TemplateAnalyzer {
  /**
   * Constructor
   *
   * @param {ESTree.TaggedTemplateExpression} node Node to analyze
   */
  constructor(node) {
    this.errors = [];
    this._node = node;
    const html = util_1.templateExpressionToHtml(node);
    const opts = {
      treeAdapter: treeAdapter,
      sourceCodeLocationInfo: true,
      onParseError: err => {
        this.errors.push(err);
      },
    };
    this._ast = parse5.parseFragment(html, opts);
  }
  /**
   * Create an analyzer instance for a given node
   *
   * @param {ESTree.TaggedTemplateExpression} node Node to use
   * @return {!TemplateAnalyzer}
   */
  static create(node) {
    let cached = analyzerCache.get(node);
    if (!cached) {
      cached = new TemplateAnalyzer(node);
      analyzerCache.set(node, cached);
    }
    return cached;
  }
  /**
   * Returns the ESTree location equivalent of a given parsed location.
   *
   * @param {treeAdapter.Node} node Node to retrieve location of
   * @return {?ESTree.SourceLocation}
   */
  getLocationFor(node) {
    if (treeAdapter.isElementNode(node)) {
      const loc = node.sourceCodeLocation;
      if (loc) {
        return this.resolveLocation(loc.startTag);
      }
    } else if (treeAdapter.isCommentNode(node) || treeAdapter.isTextNode(node)) {
      const loc = node.sourceCodeLocation;
      if (loc) {
        return this.resolveLocation(loc);
      }
    }
    return this._node.loc;
  }
  /**
   * Returns the ESTree location equivalent of a given attribute
   *
   * @param {treeAdapter.Element} element Element which owns this attribute
   * @param {string} attr Attribute name to retrieve
   * @return {?ESTree.SourceLocation}
   */
  getLocationForAttribute(element, attr) {
    if (!element.sourceCodeLocation) {
      return null;
    }
    const loc = element.sourceCodeLocation.attrs[attr.toLowerCase()];
    return loc ? this.resolveLocation(loc) : null;
  }
  /**
   * Returns the raw attribute source of a given attribute
   *
   * @param {treeAdapter.Element} element Element which owns this attribute
   * @param {string} attr Attribute name to retrieve
   * @return {string}
   */
  getRawAttributeValue(element, attr) {
    if (!element.sourceCodeLocation) {
      return null;
    }
    const xAttribs = element['x-attribsPrefix'];
    let originalAttr = attr.toLowerCase();
    if (xAttribs && xAttribs[attr]) {
      originalAttr = `${xAttribs[attr]}:${attr}`;
    }
    if (element.attribs[attr] === '') {
      return '';
    }
    const loc = element.sourceCodeLocation.attrs[originalAttr];
    let str = '';
    for (const quasi of this._node.quasi.quasis) {
      const placeholder = util_1.getExpressionPlaceholder(this._node, quasi);
      const val = quasi.value.raw + placeholder;
      str += val;
      if (loc.endOffset < str.length) {
        const fullAttr = str.substring(loc.startOffset + attr.length + 1, loc.endOffset);
        if (fullAttr.startsWith('"') && fullAttr.endsWith('"')) {
          return fullAttr.replace(/(^"|"$)/g, '');
        }
        if (fullAttr.startsWith("'") && fullAttr.endsWith("'")) {
          return fullAttr.replace(/(^'|'$)/g, '');
        }
        return fullAttr;
      }
    }
    return null;
  }
  /**
   * Resolves a Parse5 location into an ESTree location
   *
   * @param {parse5.Location} loc Location to convert
   * @return {ESTree.SourceLocation}
   */
  resolveLocation(loc) {
    let offset = 0;
    for (const quasi of this._node.quasi.quasis) {
      const placeholder = util_1.getExpressionPlaceholder(this._node, quasi);
      offset += quasi.value.raw.length + placeholder.length;
      if (loc.startOffset < offset) {
        return quasi.loc;
      }
    }
    return null;
  }
  /**
   * Traverse the inner HTML tree with a given visitor
   *
   * @param {Visitor} visitor Visitor to apply
   * @return {void}
   */
  traverse(visitor) {
    const visit = (node, parent) => {
      if (!node) {
        return;
      }
      if (visitor.enter) {
        visitor.enter(node, parent);
      }
      if (node.type === 'root') {
        if (visitor.enterDocumentFragment) {
          visitor.enterDocumentFragment(node, parent);
        }
      } else if (treeAdapter.isCommentNode(node)) {
        if (visitor.enterCommentNode) {
          visitor.enterCommentNode(node, parent);
        }
      } else if (treeAdapter.isTextNode(node)) {
        if (visitor.enterTextNode) {
          visitor.enterTextNode(node, parent);
        }
      } else if (treeAdapter.isElementNode(node)) {
        if (visitor.enterElement) {
          visitor.enterElement(node, parent);
        }
      }
      if (treeAdapter.isElementNode(node) || node.type === 'root') {
        const children = node.childNodes;
        if (children && children.length > 0) {
          children.forEach(child => {
            visit(child, node);
          });
        }
      }
      if (visitor.exit) {
        visitor.exit(node, parent);
      }
    };
    visit(this._ast, null);
  }
}
exports.TemplateAnalyzer = TemplateAnalyzer;
