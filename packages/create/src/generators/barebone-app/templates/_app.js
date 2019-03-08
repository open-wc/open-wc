import { LitElement, html } from 'lit-element';

class <%= className %> extends LitElement {
	render() {
		return html`
			<h1>Hello world!</h1>
		`;
	}
}

customElements.define('<%= tagName %>', <%= className %>);
