/**
 * @typedef {object} LitA11yParserServices
 * @property {boolean} shouldAnalyseHtmlTaggedLiterals;
 * @property {string[]} [litHtmlNamespaces]
 * @property {string[]} [litHtmlTags]
 * @property {string[]} [litHtmlSpecifiers]
 */

/**
 * @typedef {object} LitA11ySettings
 * @property { boolean|string[] } [litHtmlSources]
 */

/**
 * @typedef {import('eslint').Rule.RuleContext} _LitA11yRuleContext
 * @property {{ litHtmlSources: boolean | string[] }} settings
 * @property {LitA11yParserServices} parserServices
 */

/**
 * @typedef {object} LitA11ySourceCode
 * @property {LitA11yParserServices} parserServices
 */

/**
 * @typedef {object} LitA11yRuleContextExtensions
 * @property {LitA11ySettings} settings
 * @property {LitA11yParserServices} parserServices
 * @property {LitA11ySourceCode} sourceCode
 */

/**
 * @typedef {Omit<import('eslint').Rule.RuleContext, 'settings'|'parserServices'|'sourceCode'> & LitA11yRuleContextExtensions} LitA11yRuleContext
 */
import { getParserServices } from './getContextSourceCode.js';

const DEFAULT_LIT_HTML_SPECIFIERS = ['lit-html', 'lit-element', 'lit'];

/**
 * Given an import id like `lit-html/lit-html.js`, returns the package name i.e. `lit-html`
 * @param {string|number|boolean|RegExp} id
 * @return {string}
 */
function getPackageName(id) {
  const moduleSpecifier = id.toString();
  if (!moduleSpecifier.startsWith('@')) return id.toString().split('/')[0];

  const [scope, pkg] = moduleSpecifier.split('/');
  return [scope, pkg].join('/');
}

/** @typedef {import('estree').ImportDeclaration & import('eslint').Rule.NodeParentExtension} ImportNode */

/**
 * @param {LitA11yRuleContext} context
 * @param {ImportNode} node
 */
const isLitHtmlImport =
  (context, node) =>
  /** @param {ImportNode['specifiers'][number]} specifier */
  specifier =>
    specifier.type !== 'ImportDefaultSpecifier' &&
    (specifier.type === 'ImportNamespaceSpecifier' || specifier.type === 'ImportSpecifier') &&
    getParserServices(context).litHtmlSpecifiers.includes(getPackageName(node.source.value));

/**
 * Is this ImportDeclaration importing lit-html, taking the user's settings into account
 * @param {ImportNode} node
 * @param {LitA11yRuleContext} context
 */
function isLitHtmlImportDeclaration(node, context) {
  const { specifiers = [] } = node;
  return specifiers.some(isLitHtmlImport(context, node));
}

/**
 * @param {import('estree').ImportSpecifier | import('estree').ImportDefaultSpecifier | import('estree').ImportNamespaceSpecifier} specifier
 * @return {specifier is import('estree').ImportNamespaceSpecifier}
 */
function isNamespaceImport(specifier) {
  return specifier.type === 'ImportNamespaceSpecifier';
}

/**
 * Returns a list of lit-html tag function names
 * @param {import('estree').ImportDeclaration & import('eslint').Rule.NodeParentExtension} node
 * @return {string[]}
 */
function getLitHtmlTags(node) {
  return node.specifiers
    .map(specifier => {
      switch (specifier.type) {
        case 'ImportNamespaceSpecifier':
          return 'html';
        case 'ImportSpecifier':
          if (specifier.imported.name === 'html') return specifier.local.name || 'html';
          return '';
        default:
          return '';
      }
    })
    .filter(Boolean);
}

/**
 * Returns a list of lit-html tag function names
 * @param {import('estree').ImportDeclaration & import('eslint').Rule.NodeParentExtension} node
 * @return {string[]}
 */
function getLitHtmlNamespaces(node) {
  return node.specifiers
    .map(specifier => isNamespaceImport(specifier) && specifier.local.name)
    .filter(Boolean);
}

const HasLitHtmlImportRuleExtension = {
  /**
   * @param {LitA11yRuleContext} context
   * @return {import('eslint').Rule.RuleListener}
   */
  createAdditionalVisitors(context) {
    const { litHtmlSources } = context.settings;

    const USER_LIT_HTML_SPECIFIERS = Array.isArray(context.settings.litHtmlSources)
      ? context.settings.litHtmlSources
      : [];

    getParserServices(context).litHtmlSpecifiers = [
      ...DEFAULT_LIT_HTML_SPECIFIERS,
      ...USER_LIT_HTML_SPECIFIERS,
    ];

    if (!context.settings.litHtmlSources) {
      getParserServices(context).shouldAnalyseHtmlTaggedLiterals = true;
      getParserServices(context).litHtmlTags = ['html'];
    }

    return {
      ImportDeclaration(node) {
        getParserServices(context).shouldAnalyseHtmlTaggedLiterals =
          // A previous import supplied lit-html
          getParserServices(context).shouldAnalyseHtmlTaggedLiterals ||
          // litHtmlSources is falsy -> lint everything
          !litHtmlSources ||
          // litHtmlSources is an Array -> lint only lit-html & lit-element & ...specified packages
          isLitHtmlImportDeclaration(node, context);

        if (!getParserServices(context).shouldAnalyseHtmlTaggedLiterals) return;

        getParserServices(context).litHtmlNamespaces = [
          ...new Set([
            ...(getParserServices(context).litHtmlNamespaces || []),
            ...getLitHtmlNamespaces(node),
          ]),
        ];

        getParserServices(context).litHtmlTags = [
          ...new Set([...(getParserServices(context).litHtmlTags || []), ...getLitHtmlTags(node)]),
        ];
      },
    };
  },

  /**
   * @param {import('eslint').Rule.RuleMetaData} meta
   * @param {LitA11yRuleContext} context
   */
  reportOverrides(meta, context) {
    const { shouldAnalyseHtmlTaggedLiterals } = getParserServices(context) || {};
    return !!shouldAnalyseHtmlTaggedLiterals;
  },
};

export { HasLitHtmlImportRuleExtension };
