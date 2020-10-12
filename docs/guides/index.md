# Guides ||10

The goal of Open Web Components is to empower everyone with a powerful and battle-tested setup for sharing open-source web components. We try to achieve this by giving a set of recommendations and defaults on how to facilitate your web component project. Our recommendations covers things such as development, linting, testing and building for production.

## Quickstart

This will kickstart a menu guiding you through all available Open Web Components actions.

```bash
# in a new or existing folder:
npm init @open-wc
```

```js script
import '@d4kmor/launch/inline-notification/inline-notification.js';
```

## Our Guides / Tools

Our Guides / Tools must fulfill certain criteria before we publish them.

1. Language or platform features/APIs must be released without a flag in the stable version of at least one browser
1. Libraries must offer an ES module version

**Note**: <a id="bare-specifiers"></a>We currently have ONE exception to this rule and that is 'bare modules'.
This is such a powerful and widely-used pattern in the current JavaScript ecosystem, that if you don't use it you need to implement everything yourself.
We want to help you build your apps as easily and efficiently as possible, so for now we've adopted this practice as our only exception to the above rules.
The [import maps](https://github.com/WICG/import-maps) proposal aims to bring bare modules to the web browser. You can follow that repository to stay up to date.

## Modern Web

We follow many of the development practices defined by [Modern Web](http://modern-web.dev/), our sister project. We recommend taking a look at their guides and documentation as well.
