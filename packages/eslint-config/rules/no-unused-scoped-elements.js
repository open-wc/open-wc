/**
 * @fileoverview Disallow entries in `static scopedElements` that are not used in the template.
 * @author open-wc
 */

/**
 * @fileoverview Report entries in a class's `scopedElements` whose tag name is
 * never used by that class's templates.
 *
 * Supported registration forms:
 *   static scopedElements = { 'my-el': MyEl };
 *   static get scopedElements() { return { 'my-el': MyEl }; }
 *   static get scopedElements() { return { ...super.scopedElements, 'my-el': MyEl }; }
 *
 * A tag counts as "used" when it appears as an opening tag in a tagged template
 * (`html` by default) or as a string literal passed to `createElement(...)`,
 * either inside the class or inside anything the class references in the same
 * file (module-level variables, helper functions, local superclasses, ...).
 */

const DEFAULT_TEMPLATE_TAGS = ['html'];

// Custom element names must contain a hyphen. Matches `<my-el` and `< my-el`.
const CUSTOM_ELEMENT_RE = /<\s*([a-zA-Z][\w.]*-[\w.-]*)/g;

// A template chunk ending in `<` or `</` right before `${...}` means a dynamic tag name.
const DYNAMIC_TAG_RE = /<\/?\s*$/;

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    docs: {
      description: 'Disallow scopedElements entries that are never used in the component templates',
    },
    schema: [
      {
        type: 'object',
        properties: {
          templateTags: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          ignore: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unused:
        "Scoped element '{{tag}}' is registered in scopedElements but never used in this component's templates.",
      remove: "Remove '{{tag}}' from scopedElements.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const options = context.options[0] ?? {};
    const templateTags = new Set(options.templateTags ?? DEFAULT_TEMPLATE_TAGS);
    const ignored = new Set((options.ignore ?? []).map(t => t.toLowerCase()));
    const visitorKeys = sourceCode.visitorKeys;

    // ------------------------------------------------------------------ helpers

    function staticKeyName(node) {
      if (!node) return null;
      if (!node.computed && node.key.type === 'Identifier') return node.key.name;
      if (node.key.type === 'Literal' && typeof node.key.value === 'string') return node.key.value;
      return null;
    }

    /** Collect `return <expr>` arguments of a function body, skipping nested functions. */
    function collectReturns(body) {
      const results = [];
      (function visit(node) {
        if (!node || typeof node.type !== 'string') return;
        if (node.type === 'ReturnStatement') {
          if (node.argument) results.push(node.argument);
          return;
        }
        if (
          node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' ||
          node.type === 'ArrowFunctionExpression' ||
          node.type === 'ClassDeclaration' ||
          node.type === 'ClassExpression'
        ) {
          return;
        }
        for (const key of visitorKeys[node.type] ?? []) {
          const child = node[key];
          if (Array.isArray(child)) child.forEach(visit);
          else visit(child);
        }
      })(body);
      return results;
    }

    /** Returns the object literals that define `scopedElements` on a class. */
    function getScopedElementsObjects(classNode) {
      const objects = [];
      for (const member of classNode.body.body) {
        if (!member.static || staticKeyName(member) !== 'scopedElements') continue;

        if (member.type === 'PropertyDefinition' && member.value) {
          if (member.value.type === 'ObjectExpression') objects.push(member.value);
        } else if (member.type === 'MethodDefinition' && member.kind === 'get') {
          for (const arg of collectReturns(member.value.body)) {
            if (arg.type === 'ObjectExpression') objects.push(arg);
          }
        }
      }
      return objects;
    }

    function isClass(node) {
      return node.type === 'ClassDeclaration' || node.type === 'ClassExpression';
    }

    function isTemplateTag(tag) {
      if (tag.type === 'Identifier') return templateTags.has(tag.name);
      if (tag.type === 'MemberExpression' && !tag.computed && tag.property.type === 'Identifier') {
        return templateTags.has(tag.property.name);
      }
      return false;
    }

    function stringValue(node) {
      if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
      if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0].value.cooked;
      }
      return null;
    }

    function registeredTagName(property) {
      if (property.type !== 'Property') return null; // SpreadElement etc.
      if (!property.computed && property.key.type === 'Identifier') return property.key.name;
      if (property.computed && property.key.type === 'TemplateLiteral')
        return stringValue(property.key);
      return stringValue(property.key);
    }

    function findVariable(identifier) {
      let scope = sourceCode.getScope(identifier);
      while (scope) {
        const variable = scope.set.get(identifier.name);
        if (variable) return variable;
        scope = scope.upper;
      }
      return null;
    }

    /**
     * Walks the class body plus everything it references in this file and
     * gathers the custom element tag names used there.
     */
    function collectUsage(classNode) {
      const usage = { tags: new Set(), sawTemplate: false, dynamic: false };
      const visited = new Set();
      const pending = [classNode];

      function visit(node, root) {
        if (!node || typeof node.type !== 'string' || visited.has(node)) return;
        visited.add(node);

        // A nested class with its own registry renders into its own shadow root.
        if (node !== root && isClass(node) && getScopedElementsObjects(node).length > 0) return;

        if (node.type === 'TaggedTemplateExpression' && isTemplateTag(node.tag)) {
          usage.sawTemplate = true;
          const { quasis } = node.quasi;
          quasis.forEach((quasi, index) => {
            const text = quasi.value.raw;
            for (const match of text.matchAll(CUSTOM_ELEMENT_RE)) {
              usage.tags.add(match[1].toLowerCase());
            }
            if (index < quasis.length - 1 && DYNAMIC_TAG_RE.test(text)) usage.dynamic = true;
          });
        }

        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression' &&
          !node.callee.computed &&
          node.callee.property.name === 'createElement' &&
          node.arguments.length > 0
        ) {
          usage.sawTemplate = true;
          const name = stringValue(node.arguments[0]);
          if (name === null) usage.dynamic = true;
          else usage.tags.add(name.toLowerCase());
        }

        if (node.type === 'Identifier') {
          const variable = findVariable(node);
          for (const def of variable?.defs ?? []) {
            if (
              def.type === 'Variable' ||
              def.type === 'FunctionName' ||
              def.type === 'ClassName'
            ) {
              pending.push(def.node);
            }
          }
        }

        for (const key of visitorKeys[node.type] ?? []) {
          const child = node[key];
          if (Array.isArray(child)) child.forEach(c => visit(c, root));
          else visit(child, root);
        }
      }

      while (pending.length > 0) {
        const next = pending.pop();
        visit(next, next);
      }
      return usage;
    }

    function removeProperty(fixer, property) {
      const after = sourceCode.getTokenAfter(property);
      if (after && after.value === ',') {
        return fixer.removeRange([
          property.range[0],
          sourceCode.getTokenAfter(after, { includeComments: true }).range[0],
        ]);
      }
      const before = sourceCode.getTokenBefore(property);
      if (before && before.value === ',') {
        return fixer.removeRange([before.range[0], property.range[1]]);
      }
      return fixer.remove(property);
    }

    // ------------------------------------------------------------------- rule

    function checkClass(classNode) {
      const objects = getScopedElementsObjects(classNode);
      if (objects.length === 0) return;

      const usage = collectUsage(classNode);
      // No templates at all (e.g. render() is inherited from an imported base class)
      // or a dynamic tag name: we can't tell what's used, so stay quiet.
      if (!usage.sawTemplate || usage.dynamic) return;

      for (const object of objects) {
        for (const property of object.properties) {
          const tag = registeredTagName(property);
          if (tag === null) continue;
          const normalized = tag.toLowerCase();
          if (usage.tags.has(normalized) || ignored.has(normalized)) continue;

          context.report({
            node: property,
            messageId: 'unused',
            data: { tag },
            suggest: [
              {
                messageId: 'remove',
                data: { tag },
                fix: fixer => removeProperty(fixer, property),
              },
            ],
          });
        }
      }
    }

    return {
      ClassDeclaration: checkClass,
      ClassExpression: checkClass,
    };
  },
};
