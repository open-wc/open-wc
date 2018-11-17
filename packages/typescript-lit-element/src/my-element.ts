import {
  customElement,
  html,
  LitElement,
  property,
} from '@polymer/lit-element';

@customElement('my-element' as any)
export class MyElement extends LitElement {
  @property({ type: String })
  public name: string = 'Hello, World!';

  protected render() {
    return html`
      <h1>${this.name}</h1>
    `;
  }
}