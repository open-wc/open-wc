/**
 * @fileoverview Enforce elements have accessible names and/or discernable text
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('eslint-plugin-lit/lib/template-analyzer.js');
const { hasAccessibleChildren } = require('../utils/hasAccessibleChildren.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { hasAccessibleName } = require('../utils/hasAccessibleName.js');
const { getContextSourceCode } = require('../utils/getContextSourceCode.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const INPUT_FIELDS = ['combobox', 'listbox', 'searchbox', 'slider', 'spinbutton', 'textbox'];

const INPUT_BUTTONS = ['button', 'submit', 'reset'];

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/** @type {import("eslint").Rule.RuleModule} */
const ButtonHasContentRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce elements have accessible names and/or discernable text.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/accessible-name.md',
    },
    messages: {
      name: '{{kind}} must have an accessible name.',
      hidden: 'Headings must not be hidden from screenreaders.',
    },
    fixable: null,
    schema: [
      {
        customButtonElements: {
          type: 'array',
          description: 'list of custom elements tag names which should be considered buttons',
          default: [],
          uniqueItems: true,
          additionalItems: false,
          items: {
            type: 'string',
            pattern: '^[a-z]\\w+-\\w+',
          },
        },
      },
      {
        customLinkElements: {
          type: 'array',
          description: 'list of custom elements tag names which should be considered links',
          default: [],
          uniqueItems: true,
          additionalItems: false,
          items: {
            type: 'string',
            pattern: '^[a-z]\\w+-\\w+',
          },
        },
      },
      {
        customHeadingElements: {
          type: 'array',
          description: 'list of custom elements tag names which should be considered headings',
          default: [],
          uniqueItems: true,
          additionalItems: false,
          items: {
            type: 'string',
            pattern: '^[a-z]\\w+-\\w+',
          },
        },
      },
    ],
  },
  create(context) {
    function isRelevantElement(element, relevantElements = []) {
      return relevantElements.includes(element.name);
    }

    function isValueAttributeEmpty(element) {
      return element?.attribs?.value === undefined || element?.attribs?.value?.trim() === '';
    }

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);
          const options = (context.options && context.options[0]) || {};

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (
                element.name === 'input' &&
                INPUT_BUTTONS.some(type => element?.attribs?.type === type) &&
                !isHiddenFromScreenReader(element)
              ) {
                let err = false;

                if (
                  element.attribs.type === 'button' &&
                  !hasAccessibleName(element) &&
                  isValueAttributeEmpty(element)
                ) {
                  err = true;
                }

                if (
                  element.attribs.type === 'submit' &&
                  'value' in element.attribs &&
                  !element.attribs.value.trim()
                ) {
                  err = true;
                }

                if (
                  element.attribs.type === 'reset' &&
                  'value' in element.attribs &&
                  !element.attribs.value.trim()
                ) {
                  err = true;
                }

                if (err) {
                  const loc =
                    analyzer.resolveLocation(
                      element.sourceCodeLocation.startTag,
                      getContextSourceCode(context),
                    ) ?? node.loc;

                  if (loc) {
                    context.report({
                      loc,
                      messageId: 'name',
                      data: { kind: 'Input type button, reset or submit' },
                    });
                  }
                }
              }

              // INPUT FIELDS
              if (
                INPUT_FIELDS.some(role => element?.attribs?.role === role) &&
                !hasAccessibleName(element, false) &&
                !isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({
                    loc,
                    messageId: 'name',
                    data: { kind: `Role ${element.attribs.role}` },
                  });
                }
              }

              // ROLES
              if (
                (element?.attribs?.role === 'dialog' ||
                  element?.attribs?.role === 'alertdialog' ||
                  element?.attribs?.role === 'treeitem' ||
                  element?.attribs?.role === 'tooltip' ||
                  element?.attribs?.role === 'meter' ||
                  element?.attribs?.role === 'progressbar') &&
                !hasAccessibleName(element) &&
                !isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({
                    loc,
                    messageId: 'name',
                    data: { kind: `Role ${element.attribs.role}` },
                  });
                }
              }

              // ROLES button, link, menuitem
              if (
                (element?.attribs?.role === 'button' ||
                  element?.attribs?.role === 'link' ||
                  element?.attribs?.role === 'menuitem') &&
                !hasAccessibleChildren(element) &&
                !hasAccessibleName(element) &&
                !isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({
                    loc,
                    messageId: 'name',
                    data: { kind: `Role ${element.attribs.role}` },
                  });
                }
              }

              // LINKS
              if (
                isRelevantElement(element, ['a', ...(options.customLinkElements || [])]) &&
                !hasAccessibleChildren(element) &&
                !hasAccessibleName(element, false) &&
                !isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({ loc, messageId: 'name', data: { kind: 'Links' } });
                }
              }

              // BUTTONS
              if (
                isRelevantElement(element, ['button', ...(options.customButtonElements || [])]) &&
                !hasAccessibleChildren(element) &&
                !hasAccessibleName(element) &&
                !isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({ loc, messageId: 'name', data: { kind: 'Buttons' } });
                }
              }

              // HEADINGS
              if (
                isRelevantElement(element, [
                  ...HEADINGS,
                  ...(options.customHeadingElements || []),
                ]) &&
                !hasAccessibleChildren(element) &&
                !hasAccessibleName(element) &&
                !isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({ loc, messageId: 'name', data: { kind: 'Headings' } });
                }
              }
            },
          });
        }
      },
    };
  },
};

module.exports = ruleExtender(ButtonHasContentRule, HasLitHtmlImportRuleExtension);
