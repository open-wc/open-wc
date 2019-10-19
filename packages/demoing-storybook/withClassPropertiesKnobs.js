import { text, number, date, object, array, boolean } from '@storybook/addon-knobs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from 'lit-html';

/**
 * @typedef {Object} OptionsWithClassPropertiesKnobs
 * @property {function} [overrides] Override knobs for specific properties
 * @property {import('lit-html').TemplateResult} [template] Your template if you need properties or children set
 */

/**
 * @example
 * class MyEl extends LitElement { ... }
 *
 * .add('Playground', () => {
 *   return withClassPropertiesKnobs(MyEl);
 * });
 *
 * @example
 * .add('Playground', () => {
 *   return withClassPropertiesKnobs(MyEl, el => ([
 *     { key: 'type', fn: () => select('type', ['small', 'medium', 'large'], el.type, 'Element') },
 *     { key: 'complexItems', fn: () => object('complexItems', el.complexItems, 'Inherited') },
 *     { key: 'locked', group: 'Security' }, // change group of an default Element property
 *   ]));
 * });
 * @param {any} Klass The class (not instance) you want the knobs for
 * @param {OptionsWithClassPropertiesKnobs} Options Define overrides and a template if neeed
 */
export function withClassPropertiesKnobs(Klass, { overrides: overrideFunction, template } = {}) {
  let el;
  if (template) {
    const wrapper = document.createElement('div');
    render(template, wrapper);
    // eslint-disable-next-line prefer-destructuring
    el = Array.from(wrapper.children).filter(node => node.tagName.includes('-'))[0];
  } else {
    el = new Klass();
  }

  const overrides = overrideFunction ? overrideFunction(el) : [];

  const elProperties = Klass.properties ? Object.keys(Klass.properties) : [];
  const properties = Array.from(elProperties);
  if (Klass._classProperties) {
    Array.from(Klass._classProperties.keys()).forEach(propName => {
      if (!elProperties.includes(propName)) {
        properties.push(propName);
      }
    });
  }

  properties.forEach(propName => {
    const override = overrides.find(item => item.key === propName);
    if (override && override.fn) {
      el[propName] = override.fn();
    } else {
      const isElProperty = elProperties.includes(propName);
      let group = isElProperty ? 'Element' : 'Inherited';
      if (override && override.group) {
        group = override.group; // eslint-disable-line prefer-destructuring
      }
      const prop = isElProperty ? Klass.properties[propName] : Klass._classProperties.get(propName);
      if (prop.type && prop.type.name) {
        // let method = false;
        switch (prop.type.name) {
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
    }
  });
  return el;
}
