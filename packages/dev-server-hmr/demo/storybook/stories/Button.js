import { html } from 'lit';
import '../src/my-button.js';

export const Button = args =>
  html`
    <my-button .primary=${args.primary} .size=${args.size || 'medium'}>${args.label}</my-button>
  `;
