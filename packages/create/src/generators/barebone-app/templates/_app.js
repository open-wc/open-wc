import { LitElement, html } from 'lit-element';

class <%= className %> extends LitElement {
	static get properties() {
		return {
			heading: { type: String },
		};
	}

	render() {
		return html`
			<h1>${this.heading}</h1>
		`;
	}
}

customElements.define('<%= tagName %>', <%= className %>);
