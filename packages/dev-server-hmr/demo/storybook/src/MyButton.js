import { css, html, LitElement } from 'lit';

export class MyButton extends LitElement {
  static properties = {
    size: { type: String },
    primary: { type: Boolean },
  };

  static styles = css`
    .storybook-button {
      font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 700;
      border: 0;
      border-radius: 3em;
      cursor: pointer;
      display: inline-block;
      line-height: 1;
    }
    .storybook-button--primary {
      color: white;
      background-color: #1ea7fd;
    }
    .storybook-button--secondary {
      color: #333;
      background-color: transparent;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
    }
    .storybook-button--small {
      font-size: 12px;
      padding: 10px 16px;
    }
    .storybook-button--medium {
      font-size: 14px;
      padding: 11px 20px;
    }
    .storybook-button--large {
      font-size: 16px;
      padding: 12px 24px;
    }
  `;

  constructor() {
    super();
    this.size = 'medium';
    this.primary = true;
  }

  render() {
    return html`
      <button
        class="storybook-button storybook-button--${this.size} storybook-button--${this.primary
          ? 'primary'
          : 'secondary'}"
      >
        <slot></slot>
      </button>
    `;
  }
}
