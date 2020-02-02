/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html } from 'lit-element';
import { demoWcCardStyle } from './demoWcCardStyle.css.js';
import { chevron } from './chevron.svg.js';

// @ts-ignore
export class DemoWcCard extends LitElement {
  static get properties() {
    return {
      backSide: { type: Boolean, reflect: true, attribute: 'back-side' },
      header: { type: String },
      rows: { type: Object },
    };
  }

  static get styles() {
    return demoWcCardStyle;
  }

  constructor() {
    super();
    this.backSide = false;
    this.header = 'Your Message';
    this.rows = [];
  }

  _requestUpdate(name, oldValue) {
    // @ts-ignore
    super._requestUpdate(name, oldValue);

    if (name === 'backSide') {
      this.dispatchEvent(new Event('side-changed'));
    }
  }

  toggle() {
    this.backSide = !this.backSide;
  }

  render() {
    return html`
      <div id="front">
        <div class="header">
          ${this.header}
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="footer">
          <div class="note">A</div>
          <button @click=${this.toggle}>${chevron}</button>
        </div>
      </div>
      <div id="back">
        <div class="header">
          ${this.header}
        </div>

        <div class="content">
          ${this.rows.length === 0
            ? html``
            : html`
                <dl>
                  ${this.rows.map(
                    row => html`
                      <dt>${row.header}</dt>
                      <dd>${row.value}</dd>
                    `,
                  )}
                </dl>
              `}
        </div>
        <div class="footer">
          <div class="note">B</div>
          <button @click=${this.toggle}>${chevron}</button>
        </div>
      </div>
    `;
  }
}
