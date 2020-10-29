---
title: 'The all new Open Web Components'
pageTitle: 'The all new Open Web Components'
date: 2020-10-29
published: true
description: 'A lot has happened in Open Web Components - new website, repo cleanup, change of setup and we joined Modern Web'
tags: [webcomponents, open-wc, javascript]
canonical_url: https://open-wc.org/blog/the-all-new-open-web-components/
cover_image: /blog/the-all-new-open-web-components/images/blog-header.jpg
socialMediaImage: /blog/the-all-new-open-web-components/images/social-media-image.jpg
---

It has been an incredibly busy year for Open Web Components. A lot has happened behind the scenes and there is still more to come.

Let's talk about the obvious first.

## The all-new Open Web Components website

As you may have noticed we completely restructured all our content. There is now a clear distinction between Guides and Documentation.

In [Guides](../../guides/index.md) we focus more on step by step explanations while [Documentation](../../docs/index.md) is meant as a reference book where you can look up all available options and configuration.

In Guides you can find some of our most popular pages like [Codelabs](../../guides/developing-components/codelabs.md), [Code Examples](../../guides/developing-components/code-examples.md) or [Publishing](../../guides/developing-components/publishing.md). However we also added a complete new [Community](../../guides/community/getting-started.md) section which showcases web component communities you can join and differentt Base Libraries and Component Libraries you should check out.

We also made the FAQ pages more prominent in a new knowledge section. There we share things like how [attributes and properties](../../guides/knowledge/attributes-and-properties.md) or [events](../../guides/knowledge/events.md) work.

Technically the new website is built using [eleventy](11ty.dev), [rollup](https://rollupjs.org/), and our own tools like Web Dev Server, Rollup HTML plugin, and MDJS. We use a service worker that caches the static HTML pages.

## Cleanup our repo

Over the last years, we have created different projects and recommendations. During this time certain projects have become deprecated as we moved on to different tools or approaches.

This doesn't mean that we've completely dropped support for these projects. While we don't feature them on the main website, we still maintain and support these projects. We don't develop any new features or functionalities, but we will continue to support bugfixes and in some cases update along with the dependent tooling.

The documentation for our legacy projects is maintained in the GitHub readmes:

### Legacy projects

- [es-dev-server](https://github.com/open-wc/es-dev-server): we rebranded it as [web-dev-server](https://modern-web.dev/docs/dev-server/overview/)
- [testing-karma](https://github.com/open-wc/legacy/tree/master/packages/testing-karma) & [karma-esm](https://github.com/open-wc/legacy/tree/master/packages/karma-esm): we now recommend [web-test-runner](https://modern-web.dev/docs/test-runner/overview/)
- [testing-karma-bs](https://github.com/open-wc/legacy/tree/master/packages/testing-karma-bs): we now recommend [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) & [@web/test-runner-browserstack](https://modern-web.dev/docs/test-runner/browser-launchers/browserstack/)
- [rollup-plugin-index-html](https://github.com/open-wc/legacy/tree/master/packages/rollup-plugin-index-html): we now recommend `@web/rollup-plugin-html`
- [webpack-import-meta-loader](https://github.com/open-wc/legacy/tree/master/packages/webpack-import-meta-loader): we now recommend [babel-plugin-bundled-import-meta](https://www.npmjs.com/package/babel-plugin-bundled-import-meta)
- [building-webpack](https://github.com/open-wc/legacy/tree/master/packages/building-webpack): we now recommend rollup over webpack
- [webpack-index-html-plugin](https://github.com/open-wc/legacy/tree/master/packages/webpack-index-html-plugin): we now recommend rollup over webpack
- [storybook-addon-web-components-knobs](https://github.com/open-wc/legacy/tree/master/packages/storybook-addon-web-components-knobs): storybook v6 has a new better knobs system

We also move out our [create](https://github.com/open-wc/create) Generators into a dedicated repository - which is only our first step as we will later automate updating it's dependencies via a bot so you can always be sure you get the latest versions.

As we [announced before](https://github.com/open-wc/open-wc/issues/1681), we have moved some generic tools and recommendations to our new [Modern Web](http://modern-web.dev/) project.

## Change our setup

On top of moving out all "dusty" code, we changed the setup of our repository.

We are now using [changesets](https://github.com/atlassian/changesets) to gives us more control about what gets released and how.
With [github actions](https://github.com/features/actions) we run our tests on multiple node versions (12 & 14) and windows at the same time so we can make sure our tools don't break.

Additionally, our web testing is now performed by [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) which runs web tests in all evergreen browsers within a GitHub action.

## Return focus to Web Components

With all those general web development packages moved to [Modern Web](https://modern-web.dev) and all those legacy packages move out of the repo we can bring our focus back to web components.

You will see more web component specific guides and tools coming up.

One of those is our just recently released [eslint-plugin-lit-a11y](../../docs/linting/eslint-plugin-lit-a11y/overview.md). It features more than 20 rules that will help you write more accessible lit-html templates.

## Issues and discussions

We do have a fair share of open issues which makes it sometimes hard to see/understand what are actual bugs/issues and what are feature requests or questions. Additionally, with all these packages some issues probably are not relevant anymore. We plan to clean this up in the upcoming weeks by

1. Moving issues to the appropriate repository (if it's code got moved)
2. Moving feature requests into [github discussions](https://github.com/open-wc/open-wc/discussions)
3. This will leave only actual bugs in our [issue list](https://github.com/open-wc/open-wc/issues) 💪

We do hope this will make navigating out Github Page easier.

## Joining Modern Web

This now also makes it more apparent that we are part of the [Modern Web Family](https://modern-web.dev/discover/about/).

So be sure to follow Modern Web on [Twitter](https://twitter.com/modern_web_dev) and if you like what you see please consider sponsoring the project on [Open Collective](https://opencollective.com/modern-web).

Written with ♥️ &nbsp; by the Open Web Components Core Team
