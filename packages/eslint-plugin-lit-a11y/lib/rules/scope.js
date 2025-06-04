/**
 * @fileoverview Enforce scope prop is only used on <th> elements.
 * @author open-wc
 */
import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getLiteralAttributeValue } from '../utils/getLiteralAttributeValue.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validScopeValues = ['col', 'row', 'rowgroup', 'colgroup'];

/** @type {import("eslint").Rule.RuleModule} */
const ScopeRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce scope prop is only used on <th> elements.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/scope.md',
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              for (const attr of Object.keys(element.attribs)) {
                if (attr !== 'scope') return;

                const role = getLiteralAttributeValue(
                  analyzer,
                  element,
                  'scope',
                  getContextSourceCode(context),
                );
                if (role === undefined) return;

                if (element.name !== 'th' && !element.name.includes('-')) {
                  const loc =
                    analyzer.getLocationForAttribute(
                      element,
                      'scope',
                      getContextSourceCode(context),
                    ) ?? node.loc;
                  if (loc) {
                    context.report({
                      loc,
                      message: 'The scope attribute may only be used on <th> elements.',
                    });
                  }
                } else if (
                  element.name === 'th' &&
                  !validScopeValues.includes(element.attribs.scope)
                ) {
                  const loc =
                    analyzer.getLocationForAttribute(
                      element,
                      'scope',
                      getContextSourceCode(context),
                    ) ?? node.loc;
                  if (loc) {
                    context.report({
                      loc,
                      message:
                        '"{{scope}}" is not a valid value for the scope attribute. The valid values are: {{validScopes}}.',
                      data: {
                        scope: element.attribs.scope,
                        validScopes: validScopeValues.join(', '),
                      },
                    });
                  }
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(ScopeRule, HasLitHtmlImportRuleExtension);
