/* eslint-disable */
import { render } from 'lit-html';
import { elementUpdated } from '@open-wc/testing-helpers/index-no-side-effects.js';
import { array, boolean, color, date, text, number, object } from '@storybook/addon-knobs';
import { manager } from '@storybook/addon-knobs/dist/registerKnobs.js';

function getType(meta) {
  let type = 'string';
  if (meta.type) {
    type = meta.type;
  }
  if (meta.storybookKnobs && meta.storybookKnobs.type) {
    type = meta.storybookKnobs.type;
  }
  return type.toLowerCase();
}

function getGroupName(
  meta,
  index,
  defaultGroup = 'Properties',
  multiple = false,
  filterProperties,
) {
  if (filterProperties) {
    return 'Debug';
  }
  let group = defaultGroup;
  if (meta.storybookKnobs && meta.storybookKnobs.group) {
    group = meta.storybookKnobs.group;
  }

  if (multiple) {
    group = `${index}: ${group}`;
  }

  return group;
}

function getLabel({ meta, elIndex, filterProperties }) {
  if (filterProperties) {
    return `${elIndex}: ${meta.name}`;
  }
  return meta.name;
}

function propertiesToKnobs({ el, elIndex, metaData, hasMultiple, filterProperties }) {
  if (metaData && metaData.properties) {
    const properties = filterProperties
      ? metaData.properties.filter(prop => filterProperties.includes(prop.name))
      : metaData.properties;

    properties.forEach(prop => {
      const propName = prop.name;
      const type = getType(prop);
      const group = getGroupName(prop, elIndex, 'Properties', hasMultiple, filterProperties);
      const label = getLabel({ meta: prop, elIndex, filterProperties });

      if (type) {
        switch (type) {
          case 'string':
            el[propName] = text(label, el[propName], group);
            break;
          case 'number':
            el[propName] = number(label, el[propName], {}, group);
            break;
          case 'array':
            el[propName] = array(label, el[propName], ',', group);
            break;
          case 'boolean':
            el[propName] = boolean(label, el[propName], group);
            break;
          case 'object':
          case 'array<object>':
            el[propName] = object(label, el[propName], group);
            break;
          case 'date':
            el[propName] = new Date(date(label, el[propName], group));
            break;
          default:
        }
      }
    });
  }
}

function cssPropertiesToKnobs(el, i, cssVariables, multiple) {
  cssVariables.forEach(varMeta => {
    const cssName = varMeta.name;
    const type = getType(varMeta);
    const group = getGroupName(varMeta, i, 'CSS', multiple);

    const validTypes = ['length', 'string', 'color'];

    if (validTypes.includes(type)) {
      let value;
      const style = window.getComputedStyle(el);
      const defaultValue = style.getPropertyValue(cssName);
      switch (type) {
        case 'string':
        case 'length':
          value = text(cssName, defaultValue, group);
          break;
        case 'color':
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

function syncElToKnobs(el, elIndex, metaData, multiple, filterProperties) {
  if (metaData.properties) {
    const properties = filterProperties
      ? metaData.properties.filter(prop => filterProperties.includes(prop.name))
      : metaData.properties;
    properties.forEach(property => {
      const group = getGroupName(property, elIndex, 'Properties', multiple, filterProperties);
      const label = getLabel({ meta: property, elIndex, filterProperties });
      const knobsName = `${label}_${group}`;
      manager.knobStore.update(knobsName, { value: el[property.name] });
    });
  }
  // // TODO: find a way to update css
  // if (metaData.cssProperties) {
  //   metaData.cssProperties.forEach(property => {
  //     const group = getGroupName(property, '', elIndex, 'CSS', multiple);
  //     const knobsName = `${property.name}_${group}`;
  //     const style = window.getComputedStyle(el);
  //     const value = style.getPropertyValue(property);

  //     manager.knobStore.update(knobsName, { value });
  //   });
  // }
  manager._mayCallChannel();
}

export function withWebComponentsKnobs(storyFn, data) {
  // @ts-ignore
  let customElements = window.__STORYBOOK_CUSTOM_ELEMENTS__;

  if (isValidComponent(data.parameters.component) && isValidMetaData(customElements)) {
    let querySelectorAll = data.parameters.component;
    if (data.parameters.customElements) {
      customElements = { ...customElements, ...data.parameters.customElements };
    }
    if (customElements.querySelectorAll) {
      querySelectorAll = customElements.querySelectorAll;
    }
    const { filterProperties } = customElements;

    const wrapper = document.createElement('div');
    render(storyFn(), wrapper);

    const wcTags = Array.from(wrapper.querySelectorAll(querySelectorAll)).filter(node =>
      node.tagName.includes('-'),
    );

    if (wcTags.length === 0) {
      throw new Error(`The provided querySelectorString "${querySelectorAll}" did
        not select any custom elements (with a "-" in the tag name)`);
    }

    const hasMultiple = wcTags.length > 1;

    wcTags.forEach((el, elIndex) => {
      const metaData = customElements.tags.find(tag => tag.name.toUpperCase() === el.tagName);
      if (metaData && metaData.properties) {
        propertiesToKnobs({ el, elIndex, metaData, hasMultiple, filterProperties });
      }
      // wait for elementUpdated as web component may come with predefined styles in shadow dom
      elementUpdated(el).then(() => {
        if (!filterProperties && metaData && metaData.cssProperties) {
          cssPropertiesToKnobs(el, elIndex, metaData.cssProperties, hasMultiple);
        }
      });

      if (metaData) {
        const defaultEventNames = ['click', 'focusin', 'focusout', 'keyup'];
        const userEventNames = metaData.events ? metaData.events.map(item => item.name) : [];
        const uniqueEventNames = [...new Set([...defaultEventNames, ...userEventNames])];
        uniqueEventNames.forEach(evName => {
          el.addEventListener(evName, () => {
            syncElToKnobs(el, elIndex, metaData, hasMultiple, filterProperties);
          });
        });
      }
    });
    return wrapper;
  }

  return storyFn();
}
