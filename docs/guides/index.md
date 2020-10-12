# Guides ||10

The goal of Open Web Components is to empower everyone with a powerful and battle-tested setup for sharing open source web components. We try to achieve this by giving a set of recommendations and defaults on how to facilitate your web component project. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

## Quickstart

This will kickstart a menu guiding you through all available Open Web Components actions.

```bash
# in a new or existing folder:
npm init @open-wc
```

```js script
import { LitElement, css, html } from 'lit-element';

customElements.define(
  'inline-notification',
  class extends LitElement {
    static get properties() {
      return {
        type: { type: String },
      };
    }

    static get styles() {
      return css`
        :host {
          padding: 0.1rem 1.5rem;
          border-left-width: 0.5rem;
          border-left-style: solid;
          margin: 1rem 0;
          display: block;
        }

        h3 {
          font-weight: 600;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        :host([type='warning']) {
          background-color: rgba(255, 229, 100, 0.2);
          border-color: #e7c000;
          xcolor: #6b5900;
        }

        :host([type='warning']) h3 {
          color: #b29400;
        }

        ::slotted(p) {
          line-height: 1.7;
        }
      `;
    }

    render() {
      return html`
        <h3>${this.type}</h3>
        <slot></slot>
      `;
    }
  },
);
```

## Our Guides / Tools

Our Guides / Tools must fulfill certain criteria before we publish them.

1. Language or platform features/APIs must be released without a flag in the stable version of at least one browser
1. Libraries must offer an ES module version

**Note**: <a id="bare-specifiers"></a>We currently have ONE exception to this rule and that is 'bare modules'.
This is such a powerful and widely-used pattern in the current JavaScript ecosystem, that if you don't use it you basically need to implement everything yourself.
We want to help you build your apps as easily and efficiently as possible, so for now we've adopted this practice as our only exception to the above rules.
The [import maps](https://github.com/WICG/import-maps) proposal aims to bring bare modules to the web browser. You can follow that repository to stay up to date.

## Workflows

We recommend implementing the following three workflows for specific tasks while developing your component or application.
You are encouraged to freely switch between them depending on what you are working on.

### Development Workflow

The ideal development environment uses no tools, just an up-to-date browser and a simple HTTP server.

<inline-notification type="warning">

Unfortunately we are not fully there yet, because of the [bare modules exception](#bare-specifiers) you will still need to have a server that at least supports them.
We recommend [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/) as it does exactly this.

</inline-notification>

When would you choose this workflow:

- When developing new features

Why would you choose this:

- Simple to setup
- As fast as it gets

### Bundling Workflow

Chances are that the web components you're building will need to run in more than just the latest browser.
In these cases it's time to open your toolbox and make sure everything works in all supported browsers.

When would you choose this workflow:

- To verify everything works in all supported browsers
- To debug legacy browsers

We recommend our [Open Web Components Building Setup](../docs/building/overview.md).

Why would you choose it:

- As good as it gets when you need to work with legacy browsers
- Auto-bundling/reloading

### Production Workflow

Once you're happy with your web components, it's time to put them somewhere more useful.
Most likely a publicly available web server.
Before you do that let's apply all the optimizations magic we can cook up.

When would you use this:

- Optimize your build
- Publishing to production

We recommend our [Open Web Components Building Setup](../docs/building/overview.md).

Why would you choose it:

- Multiple bundles for differential serving
- Conditional auto-loader for those bundles (without a special server)
