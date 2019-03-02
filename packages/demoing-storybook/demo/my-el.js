/* eslint-disable no-console */

// eslint-disable-next-line import/no-extraneous-dependencies
import { LitElement, html, css } from 'lit-element';

class Base extends LitElement {
  static get properties() {
    return {
      complexOption: { type: Object },
      complexItems: { type: Array },
    };
  }

  constructor() {
    super();
    this.complexOption = { foo: 'is foo', bar: 'is bar' };
    this.complexItems = [
      { name: 'foo', age: 1000, message: 'knows all' },
      { name: 'bar', age: 1, message: 'is new here' },
    ];
  }
}

export class MyEl extends Base {
  static get styles() {
    return css`
      p {
        margin: 0;
      }
      h2 {
        color: var(--my-el-header-color);
      }
    `;
  }

  static get properties() {
    return {
      header: { type: String },
      headerColor: { type: String },
      locked: { type: Boolean },
      items: { type: Array },
      type: { type: String },
      time: { type: Date },
      age: { type: Number },
    };
  }

  constructor() {
    super();
    this.header = 'Default Header';
    this.headerColor = '#ff0000';
    this.disabled = false;
    this.items = ['A', 'B', 'C'];
    this.type = 'medium';
    this.age = 10;
    this.time = new Date();
    // time needs to stay the same so storybook knows can work with them
    this.time.setHours(0, 0, 0, 0);
    this.complexOption = { foo: 'is foo', bar: 'is bar' };
    this.complexItems = [
      { name: 'foo', age: 1000, message: 'knows all' },
      { name: 'bar', age: 1, message: 'is new here' },
    ];
  }

  update(oldValues) {
    super.update(oldValues);
    if (oldValues.has('type')) {
      const { type } = this;
      if (!(type === 'small' || type === 'medium' || type === 'large')) {
        throw new Error('Type needs to be either small, medium or large');
      }
    }
    if (oldValues.has('headerColor')) {
      this.style.setProperty('--my-el-header-color', this.headerColor);
    }
  }

  render() {
    return html`
      <h2>${this.header}</h2>
      <p>My size is: ${this.type}.</p>
      <p>I am ${this.locked ? 'locked' : 'free'} since ${this.age} years.</p>
      <p>Time: ${this.time.toDateString()}</p>
      <p>List:</p>
      <ul>
        ${this.items.map(
          item =>
            html`
              <li>${item}</li>
            `,
        )}
      </ul>
      <p>This is the light dom:</p>
      <slot></slot>
      <p>Complex Option:</p>
      <pre>${JSON.stringify(this.complexOption, null, 2)}</pre>
      <p>Complex List:</p>
      <table>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Message</th>
        </tr>
        ${this.complexItems.map(
          item =>
            html`
              <tr>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.message}</td>
              </tr>
            `,
        )}
      </table>

      <button @click=${() => console.log('my-el button clicked', this)}>
        log me to Actions/console
      </button>
    `;
  }
}

customElements.define('my-el', MyEl);
