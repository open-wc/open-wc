/* eslint-disable import/no-extraneous-dependencies */
import Parser from 'htmlparser2/lib/Parser';

// https://www.w3.org/TR/html/syntax.html#writing-html-documents-elements
const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

const defaultIgnoreTags = ['script', 'style'];
function getIgnoreTags(options) {
  return options.ignoreTags ? [...defaultIgnoreTags, ...options.ignoreTags] : defaultIgnoreTags;
}

export default function getDiffableHTML(html, options = {}) {
  const tagsBeingIgnored = [];
  const lightDomTagsBeingIgnored = [];
  const ignoreTags = getIgnoreTags(options);
  const ignoreAttributes = options.ignoreAttributes
    ? options.ignoreAttributes.filter(e => typeof e === 'string')
    : [];
  const ignoreAttributesForTags = options.ignoreAttributes
    ? options.ignoreAttributes.filter(e => typeof e !== 'string')
    : [];
  const ignoreLightDom = options.ignoreLightDom || [];
  const elements = [];
  const indentSize = 2;

  let currentDepth = 0;

  function isIgnoringTags() {
    return tagsBeingIgnored.length > 0;
  }

  function isIgnoringLightDom() {
    return lightDomTagsBeingIgnored.length > 0;
  }

  function isIgnoring() {
    return isIgnoringTags() || isIgnoringLightDom();
  }

  function onTagStartIgnored(tagName) {
    tagsBeingIgnored.push(tagName);
  }

  function onTagEndIgnored(tagName) {
    if (tagsBeingIgnored[tagsBeingIgnored.length - 1] === tagName) {
      tagsBeingIgnored.splice(tagsBeingIgnored.length - 1, 1);
    }
  }

  const increaseCurrentDepth = () => {
    currentDepth += 1;
  };

  const decreaseCurrentDepth = () => {
    currentDepth -= 1;
  };

  const getIndentation = size => ' '.repeat(size);

  const getIndentationForDepth = depth => getIndentation(indentSize * depth);

  const getCurrentIndentation = () => getIndentationForDepth(currentDepth);

  const getAttributeIndentation = tagName =>
    getIndentation(indentSize * currentDepth + tagName.length - 1);

  const append = content => {
    elements.push(content);
  };

  const appendLineBreak = () => {
    append('\n');
  };

  const appendIndentation = depth => {
    append(getIndentationForDepth(depth));
  };

  const appendCurrentIndentation = () => {
    append(getCurrentIndentation());
  };

  const appendOpeningTag = name => {
    append(`<${name}`);
  };

  const appendClosingTagOnSameLine = (closeWith = '>') => {
    append(closeWith);
  };

  const appendClosingTagOnNewLine = (closeWith = '>') => {
    appendLineBreak();
    appendIndentation(currentDepth - 1);
    append(closeWith);
  };

  const appendAttribute = (name, value) => {
    let attribute = ` ${name}`;

    if (value.length > 0) {
      attribute += `="${value}"`;
    }

    append(attribute);
  };

  const appendAttributeOnNewLine = (name, value, tagName) => {
    appendLineBreak();
    append(getAttributeIndentation(tagName));
    appendAttribute(name, value);
  };

  const isIgnoredAttribute = (attribute, tagName) => {
    if (ignoreAttributes.includes(attribute)) {
      return true;
    }

    return !!ignoreAttributesForTags.find(e => {
      if (!e.tags || !e.attributes) {
        throw new Error(
          `An object entry to ignoreAttributes should contain a 'tags' and an 'attributes' property.`,
        );
      }

      return e.tags.includes(tagName) && e.attributes.includes(attribute);
    });
  };

  const filterignoreAttributes = (attributes, tagName) => {
    const filteredAttributes = {};

    Object.keys(attributes).forEach(key => {
      if (!isIgnoredAttribute(key, tagName)) {
        filteredAttributes[key] = attributes[key];
      }
    });

    return filteredAttributes;
  };

  const appendAttributes = (attributes, tagName) => {
    const names = Object.keys(attributes);

    if (names.length === 1) {
      appendAttribute(names[0], attributes[names[0]]);
    }

    if (names.length <= 1) {
      return;
    }

    let firstAttribute = true;
    Object.keys(attributes).forEach(name => {
      if (firstAttribute === true) {
        firstAttribute = false;
        appendAttribute(name, attributes[name]);
      } else {
        appendAttributeOnNewLine(name, attributes[name], tagName);
      }
    });
  };

  const appendClosingTag = (attributes, closeWith) => {
    if (Object.keys(attributes).length <= 1) {
      appendClosingTagOnSameLine(closeWith);

      return;
    }
    appendClosingTagOnNewLine(closeWith);
  };

  const render = () => elements.join('');

  const isXmlDirective = name => name === '?xml';

  const isVoidTagName = name => voidElements.indexOf(name) !== -1;

  // https://www.w3.org/TR/html52/infrastructure.html#space-characters
  // defines "space characters" to include SPACE, TAB, LF, FF, and CR.
  const trimText = text => text.replace(/^[ \t\n\f\r]+|[ \t\n\f\r]+$/g, '');

  const extractAttributesFromString = content => {
    const attributes = {};

    const pieces = content.split(/\s/);
    // Remove tag name.
    delete pieces[0];

    pieces.forEach(element => {
      if (element.length === 0) {
        return;
      }
      if (element.indexOf('=') === -1) {
        attributes[element] = '';
      }
    });

    const attributesRegex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gim;

    let result;
    /* eslint-disable-next-line no-cond-assign */
    while ((result = attributesRegex.exec(content))) {
      /* eslint-disable-next-line prefer-destructuring */
      attributes[result[1]] = result[2];
    }

    return attributes;
  };

  const parser = new Parser(
    {
      onprocessinginstruction(tagName, data) {
        if (isIgnoringTags()) {
          return;
        }

        // don't print if we are ignoring light dom, unless this is the light dom container element
        const isLightDomContainer =
          lightDomTagsBeingIgnored.length === 1 && lightDomTagsBeingIgnored[0] === tagName;
        if (isIgnoringLightDom() && !isLightDomContainer) {
          return;
        }

        let closingTag = '>';
        if (isXmlDirective(tagName)) {
          closingTag = '?>';
        }

        appendLineBreak();
        appendCurrentIndentation();
        increaseCurrentDepth();
        appendOpeningTag(tagName);

        const attributes = extractAttributesFromString(data);
        const filteredAttributes = filterignoreAttributes(attributes, tagName);
        appendAttributes(filteredAttributes, tagName);
        appendClosingTag(filteredAttributes, closingTag);
        decreaseCurrentDepth();
      },

      onopentag(tagName, attributes) {
        // if we should ignore this tag's light dom, we need to make sure we keep track of it even if it is already
        // being ignored by a parent element
        if (ignoreLightDom.includes(tagName)) {
          lightDomTagsBeingIgnored.push(tagName);

          // if this was not the first tag on the stack, it means this should not be printed
          // if this was the first tag on the stack, we need to print it
          if (lightDomTagsBeingIgnored.length > 1) {
            return;
          }

          // else if a parent element's light dom is being ignored, we should not print this tag
        } else if (lightDomTagsBeingIgnored.length > 0) {
          return;
        }

        // we should start ignoring from this tag, don't print this tag
        if (ignoreTags.includes(tagName)) {
          onTagStartIgnored(tagName);
          return;
        }

        // tags are being ignored, don't print this tag
        if (isIgnoringTags()) {
          return;
        }

        appendLineBreak();
        appendCurrentIndentation();
        increaseCurrentDepth();
        appendOpeningTag(tagName);

        const filteredAttributes = filterignoreAttributes(attributes, tagName);
        appendAttributes(filteredAttributes, tagName);
        appendClosingTag(filteredAttributes, '>');
      },

      ontext(text) {
        if (isIgnoring()) {
          return;
        }

        const trimmed = trimText(text);
        if (trimmed.length === 0) {
          return;
        }

        appendLineBreak();
        appendCurrentIndentation();
        append(trimmed);
      },

      onclosetag(tagName) {
        if (isIgnoringTags()) {
          onTagEndIgnored(tagName);
          return;
        }

        if (isIgnoringLightDom()) {
          // if closing a tag whose light dom is being ignored, remove it from the stack
          if (lightDomTagsBeingIgnored[lightDomTagsBeingIgnored.length - 1] === tagName) {
            lightDomTagsBeingIgnored.splice(lightDomTagsBeingIgnored.length - 1, 1);
          }

          // if the current tag is being ignored because it is in the light dom of a parent element
          // whose light dom is being ignored, don't print it
          if (lightDomTagsBeingIgnored.length > 0) {
            return;
          }
        }

        const isVoidTag = isVoidTagName(tagName);
        if (isVoidTagName(tagName) === false) {
          appendLineBreak();
        }
        decreaseCurrentDepth();
        if (isVoidTag === true) {
          return;
        }
        appendCurrentIndentation();
        append(`</${tagName}>`);
      },

      oncomment() {
        // comments are always ignored
      },
    },

    {
      lowerCaseTags: false,
      recognizeSelfClosing: true,
    },
  );
  parser.write(html);
  parser.end();

  appendLineBreak();

  return render();
}
