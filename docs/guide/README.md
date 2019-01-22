# Introduction

The goal of Open Web Components is to empower everyone with a powerful and battle-tested setup for sharing open source web components. We try to achieve this by giving a set of recommendations and defaults on how to facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

## Quickstart

This will bootstrap a vanilla Web Component project based on our latest recommendations.

```bash
npm i -g yo
npm i -g generator-open-wc

# scaffold a complete new component
mkdir my-element
cd my-element
# Default development recommendation
yo open-wc:scaffold-vanilla

# upgrade/align your existing web component with 'open-wc' recommendations
cd existing-web-component
yo open-wc
```

## Available Recommendations
- [IDE](/ide/)
- [Developing](/developing/)
- [Linting](/linting/)
- [Testing](/testing/)
- [Demoing](/demoing/)
- [Publishing](/publishing/)
- [Automating](/automating/)

## Our Philosophy

You can read all about our motivation and our philosophy [here](/about/).

## FAQ
- [FAQ](/faq/)

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) uses all the above recommendations.
You can find a published storybook here: [https://example-set-game-open-wc.netlify.com/](https://example-set-game-open-wc.netlify.com/).
