/* eslint-disable camelcase, strict */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const parse5 = require('parse5');
const treeAdapter = require('parse5-htmlparser2-tree-adapter');
const util_1 = require('./util');

const analyzerCache = new WeakMap();

/** @typedef {import('../lib/utils/isLitHtmlTemplate').LitTaggedExpression<'html'|'css'|'svg'>} GenericLitTaggedExpression */

/**
 * @template {treeAdapter.Node} NodeType
 * @typedef {(node: NodeType, parent: treeAdapter.Node | treeAdapter.DocumentFragment) => void} NodeVisitorCallback
 */

/**
 * @typedef {Object} Visitor
 * @property {NodeVisitorCallback<treeAdapter.Node>} [enter]
 * @property {NodeVisitorCallback<treeAdapter.DocumentFragment>} [enterDocumentFragment]
 * @property {NodeVisitorCallback<treeAdapter.CommentNode>} [enterCommentNode]
 * @property {NodeVisitorCallback<treeAdapter.TextNode>} [enterTextNode]
 * @property {NodeVisitorCallback<treeAdapter.Element>} [enterElement]
 * @property {NodeVisitorCallback<treeAdapter.Node>} [exit]
 */

/**
 * Analyzes a given template expression for traversing its contained
 * HTML tree.
 */
class TemplateAnalyzer {
  /**
   * Constructor
   *
   * @param {GenericLitTaggedExpression} node Node to analyze
   */
  constructor(node) {
    this.errors = [];
    this._node = node;
    const html = util_1.templateExpressionToHtml(node);
    /** @type{import("parse5").ParserOptions} */
    const opts = {
      treeAdapter,
      sourceCodeLocationInfo: true,
      // @ts-expect-error: this is certainly a problem with parse5's types. see https://github.com/inikulin/parse5/blob/377cdaf0a6504065e2c47bd65fb0b0a8cdabcb90/packages/parse5/lib/parser/index.js#L333-L335
      onParseError: err => {
        this.errors.push(err);
      },
    };
    /** @type {treeAdapter.DocumentType} */
    // TODO: This is not ideal
    // @ts-expect-error: parse5.DocumentFragment is a union with {}, so let's fudge this type for convenience
    this._ast = parse5.parseFragment(html, opts);
  }

  /**
   * Create an analyzer instance for a given node
   *
   * @param {GenericLitTaggedExpression} node Node to use
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
   * @return {?import("estree").SourceLocation}
   */
  getLocationFor(node) {
    if (util_1.isElementNode(node)) {
      const loc = node.sourceCodeLocation;
      if (loc) {
        return this.resolveLocation(loc.startTag);
      }
    } else if (util_1.isCommentNode(node) || util_1.isTextNode(node)) {
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
   * @return {?import("estree").SourceLocation}
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
   * @return {import("estree").SourceLocation}
   */
  resolveLocation(loc) {
    return {
      start: { line: loc.startLine - 1 + this._node.loc.start.line, column: loc.startCol - 1 },
      end: { line: loc.endLine - 1 + this._node.loc.start.line, column: loc.endCol - 1 },
    };
  }

  /**
   * Traverse the inner HTML tree with a given visitor
   *
   * @param {Visitor} visitor Visitor to apply
   * @return {void}
   */
  traverse(visitor) {
    /**
     * @param {treeAdapter.Node | treeAdapter.DocumentFragment} node
     * @param {treeAdapter.Node | treeAdapter.DocumentFragment} parent
     */
    const visit = (node, parent) => {
      if (!node) {
        return;
      }

      if (visitor.enter) {
        visitor.enter(node, parent);
      }

      if (util_1.isDocumentFragment(node) && visitor.enterDocumentFragment) {
        visitor.enterDocumentFragment(node, parent);
      } else if (util_1.isCommentNode(node) && visitor.enterCommentNode) {
        visitor.enterCommentNode(node, parent);
      } else if (util_1.isTextNode(node) && visitor.enterTextNode) {
        visitor.enterTextNode(node, parent);
      } else if (util_1.isElementNode(node) && visitor.enterElement) {
        visitor.enterElement(node, parent);
      }

      if (util_1.isElementNode(node) || util_1.isDocumentFragment(node)) {
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
