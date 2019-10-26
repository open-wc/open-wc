/* eslint-disable no-param-reassign */
import { render } from 'lit-html';
import { elementUpdated } from '@open-wc/testing-helpers/index-no-side-effects.js';
import { array, boolean, color, date, text, number, object } from '@storybook/addon-knobs';

function getType(meta) {
  let type = 'String';
  if (meta.type) {
    type = meta.type;
  }
  if (meta.storybookKnobs && meta.storybookKnobs.type) {
    type = meta.storybookKnobs.type;
  }
  return type;
}

function getGroupName(meta, tagName, index, defaultGroup = 'Properties', multiple = false) {
  let group = defaultGroup;
  if (meta.storybookKnobs && meta.storybookKnobs.group) {
    group = meta.storybookKnobs.group;
  }

  if (multiple) {
    group = `${index}: ${group}`;
  }

  return group;
}

function propertiesToKnobs(el, i, properties, tagName, multiple) {
  properties.forEach(prop => {
    const propName = prop.name;
    const type = getType(prop);
    const group = getGroupName(prop, tagName, i, 'Properties', multiple);

    if (type) {
      switch (type) {
        case 'String':
          el[propName] = text(propName, el[propName], group);
          break;
        case 'Number':
          el[propName] = number(propName, el[propName], {}, group);
          break;
        case 'Array':
          el[propName] = array(propName, el[propName], ',', group);
          break;
        case 'Boolean':
          el[propName] = boolean(propName, el[propName], group);
          break;
        case 'Object':
          el[propName] = object(propName, el[propName], group);
          break;
        case 'Date':
          el[propName] = new Date(date(propName, el[propName], group));
          break;
        default:
      }
    }
  });
}

function cssPropertiesToKnobs(el, i, cssVariables, tagName, multiple) {
  cssVariables.forEach(varMeta => {
    const cssName = varMeta.name;
    const type = getType(varMeta);
    const group = getGroupName(varMeta, tagName, i, 'CSS', multiple);

    const validTypes = ['String', 'Color'];

    if (validTypes.includes(type)) {
      let value;
      const style = window.getComputedStyle(el);
      const defaultValue = style.getPropertyValue(cssName);
      switch (type) {
        case 'String':
          value = text(cssName, defaultValue, group);
          break;
        case 'Color':
          value = color(cssName, defaultValue, group);
          break;
        /* no default */
      }
      if (value) {
        el.style.setProperty(cssName, value);
      }
    }
  });
}

function isValidComponent(tagName) {
  if (!tagName) {
    return false;
  }
  if (typeof tagName === 'string') {
    return true;
  }
  throw new Error('Provided component needs to be a string. e.g. component: "my-element"');
}

function isValidMetaData(customElements) {
  if (!customElements) {
    return false;
  }
  if (customElements.tags && Array.isArray(customElements.tags)) {
    return true;
  }
  throw new Error(`You need to setup valid meta data in your config.js via setCustomElements().
    See the readme of addon-docs for web components for more details.`);
}

export function withWebComponentsKnobs(storyFn, data) {
  // @ts-ignore
  let customElements = window.__STORYBOOK_CUSTOM_ELEMENTS__;

  if (isValidComponent(data.parameters.component) && isValidMetaData(customElements)) {
    let queryString = data.parameters.component;
    if (data.parameters.customElements) {
      customElements = { ...customElements, ...data.parameters.customElements };
    }
    if (customElements.queryString) {
      queryString = customElements.queryString;
    }

    const wrapper = document.createElement('div');
    render(storyFn(), wrapper);

    const wcTags = Array.from(wrapper.querySelectorAll(queryString)).filter(node =>
      node.tagName.includes('-'),
    );

    if (wcTags.length === 0) {
      throw new Error(`The provided querySelectorString "${queryString}" did
        not select any custom elements (with a "-" in the tag name)`);
    }

    const hasMultiple = wcTags.length > 1;

    wcTags.forEach((el, i) => {
      const metaData = customElements.tags.find(tag => tag.name.toUpperCase() === el.tagName);
      elementUpdated(el).then(() => {
        if (metaData && metaData.properties) {
          propertiesToKnobs(el, i, metaData.properties, metaData.name, hasMultiple);
        }
        if (metaData && metaData.cssProperties) {
          cssPropertiesToKnobs(el, i, metaData.cssProperties, metaData.name, hasMultiple);
        }
      });
    });
    return wrapper;
  }

  return storyFn();
}
