/**
 * @typedef {object} LitA11yParserServices
 * @property {boolean} shouldAnalyseHtmlTaggedLiterals;
 * @property {string[]} [litHtmlNamespaces]
 * @property {string[]} [litHtmlTags]
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
 * @typedef {object} LitA11yRuleContextExtensions
 * @property {LitA11ySettings} settings
 * @property {LitA11yParserServices} parserServices
 */

/**
 * @typedef {Omit<import('eslint').Rule.RuleContext, 'settings'|'parserServices'> & LitA11yRuleContextExtensions} LitA11yRuleContext
 */

const DEFAULT_LIT_HTML_SPECIFIERS = ['lit-html', 'lit-element'];

/** @type {WeakMap<import('eslint').Rule.RuleContext, string[]>} */
const contextSpecifiers = new WeakMap();

/**
 * Returns a list of acceptable lit-html exporting module specifiers
 * @param {LitA11yRuleContext} context
 * @return {string[]}
 */
function getLitHtmlSpecifiers(context) {
  if (!contextSpecifiers.has(context)) {
    const USER_LIT_HTML_SPECIFIERS = Array.isArray(context.settings.litHtmlSources)
      ? context.settings.litHtmlSources
      : DEFAULT_LIT_HTML_SPECIFIERS;
    contextSpecifiers.set(context, [...DEFAULT_LIT_HTML_SPECIFIERS, ...USER_LIT_HTML_SPECIFIERS]);
  }

  return contextSpecifiers.get(context);
}

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

/**
 * Is this ImportDeclaration importing lit-html, taking the user's settings into account
 * @param {import('estree').ImportDeclaration & import('eslint').Rule.NodeParentExtension} node
 * @param {LitA11yRuleContext} context
 */
function isLitHtmlImportDeclaration(node, context) {
  /** @param {typeof node.specifiers[number]} specifier */
  const isLitHtmlImport = specifier =>
    (specifier.type && specifier.type === 'ImportNamespaceSpecifier') ||
    (specifier.type === 'ImportSpecifier' &&
      getLitHtmlSpecifiers(context).includes(getPackageName(node.source.value)));

  const { specifiers = [] } = node;

  return specifiers.some(isLitHtmlImport);
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
    /**
     * if user set `litHtmlSources` to literal `false`,
     * consider every tagged-template-literal with tag name `html`
     * to be a lit-html template.
     */
    const userExplicitlyDisabledImportValidation = context.settings.litHtmlSources === false;

    /* eslint-disable no-param-reassign */

    context.parserServices.shouldAnalyseHtmlTaggedLiterals = userExplicitlyDisabledImportValidation;

    return {
      ImportDeclaration(node) {
        const shouldAnalyseNode =
          userExplicitlyDisabledImportValidation || isLitHtmlImportDeclaration(node, context);

        if (shouldAnalyseNode) {
          context.parserServices.shouldAnalyseHtmlTaggedLiterals = true;

          context.parserServices.litHtmlNamespaces = [
            ...(context.parserServices.litHtmlNamespaces || []),
            ...getLitHtmlNamespaces(node),
          ];

          context.parserServices.litHtmlTags = [
            ...(context.parserServices.litHtmlTags || []),
            ...getLitHtmlTags(node),
          ];
        }
      },
    };

    /* eslint-enable no-param-reassign */
  },

  /**
   * @param {import('eslint').Rule.RuleMetaData} meta
   * @param {LitA11yRuleContext} context
   */
  reportOverrides(meta, context) {
    const { shouldAnalyseHtmlTaggedLiterals } = context.parserServices || {};
    return !!shouldAnalyseHtmlTaggedLiterals;
  },
};

module.exports = {
  HasLitHtmlImportRuleExtension,
};
