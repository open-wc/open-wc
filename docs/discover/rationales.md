---
title: Rationales
eleventyNavigation:
  key: Rationales
---

Our recommendations must fulfill certain criteria before we publish them.

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

<div class="custom-block warning"><p class="custom-block-title">WARNING</p> <p>Unfortunately we are not fully there yet, because of the <a href="#bare-specifiers">bare modules exception</a> you will still need to have a server that at least supports them.
We recommend our <a href="../developing/es-dev-server.html" class="">ES Dev Server</a> as it does nothing more/nothing less.</p></div>

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

We recommend our [Open Web Components Building Setup](../building).

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

We recommend our [Open Web Components Building Setup](../building).

Why would you choose it:

- Multiple bundles for differential serving
- Conditional auto-loader for those bundles (without a special server)
