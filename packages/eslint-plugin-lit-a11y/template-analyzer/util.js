// @ts-nocheck
/* eslint-disable */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Get the name of a node
 *
 * @param {ESTree.Node} node Node to retrieve name of
 * @return {?string}
 */
function getIdentifierName(node) {
  if (node.type === 'Identifier') {
    return node.name;
  }
  if (node.type === 'Literal') {
    return node.raw;
  }
  return undefined;
}
exports.getIdentifierName = getIdentifierName;
/**
 * Get the properties object of an element class
 *
 * @param {ESTree.Class} node Class to retrieve map from
 * @return {ReadonlyMap<string, ESTreeObjectExpression>}
 */
function getPropertyMap(node) {
  const result = new Map();
  for (const member of node.body.body) {
    if (
      member.static &&
      member.kind === 'get' &&
      member.key.type === 'Identifier' &&
      member.key.name === 'properties' &&
      member.value.body
    ) {
      const ret = member.value.body.body.find(
        m =>
          m.type === 'ReturnStatement' &&
          m.argument != undefined &&
          m.argument.type === 'ObjectExpression',
      );
      if (ret) {
        const arg = ret.argument;
        for (const prop of arg.properties) {
          const name = getIdentifierName(prop.key);
          if (name && prop.value.type === 'ObjectExpression') {
            result.set(name, prop.value);
          }
        }
      }
    }
    const babelProp = member;
    const memberName = getIdentifierName(member.key);
    if (memberName && babelProp.decorators) {
      for (const decorator of babelProp.decorators) {
        if (
          decorator.expression.type === 'CallExpression' &&
          decorator.expression.callee.type === 'Identifier' &&
          decorator.expression.callee.name === 'property' &&
          decorator.expression.arguments.length > 0
        ) {
          const dArg = decorator.expression.arguments[0];
          if (dArg.type === 'ObjectExpression') {
            result.set(memberName, dArg);
          }
        }
      }
    }
  }
  return result;
}
exports.getPropertyMap = getPropertyMap;
/**
 * Generates a placeholder string for a given quasi
 *
 * @param {ESTree.TaggedTemplateExpression} node Root node
 * @param {ESTree.TemplateElement} quasi Quasi to generate placeholder
 * for
 * @return {string}
 */
function getExpressionPlaceholder(node, quasi) {
  const i = node.quasi.quasis.indexOf(quasi);
  if (/=$/.test(quasi.value.raw)) {
    return `"{{__Q:${i}__}}"`;
  }
  return `{{__Q:${i}__}}`;
}
exports.getExpressionPlaceholder = getExpressionPlaceholder;
/**
 * Tests whether a string is a placeholder or not
 *
 * @param {string} value Value to test
 * @return {boolean}
 */
function isExpressionPlaceholder(value) {
  return /^\{\{__Q:\d+__\}\}$/.test(value);
}
exports.isExpressionPlaceholder = isExpressionPlaceholder;
/**
 * Converts a template expression into HTML
 *
 * @param {ESTree.TaggedTemplateExpression} node Node to convert
 * @return {string}
 */
function templateExpressionToHtml(node) {
  let html = '';
  for (let i = 0; i < node.quasi.quasis.length; i++) {
    const quasi = node.quasi.quasis[i];
    const expr = node.quasi.expressions[i];
    html += quasi.value.raw;
    if (expr) {
      html += `{{${expr.name ? `{${expr.name}}` : expr.value}}}`;
      // html += getExpressionPlaceholder(node, quasi);
    }
  }
  return html;
}
exports.templateExpressionToHtml = templateExpressionToHtml;
