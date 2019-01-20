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

## Why open-wc

### Our philosophy

- The goal of Open Web Components is to empower everyone with a powerful and battle-tested setup for creating and sharing open source web components.
- Javascript fatigue: Enjoy the peace of mind that comes from having a well-known default solution for almost everything. Open-wc has got you covered.
- Making things accessible and approachable for people: Easy to use, ready to use, 'it just works' feeling

### Why web components

- keep it frank, and friendly (no throwing shade at frameworks)
	- close to browser standards etc
	- bundle size?

### How we work

	- Polymer slack, evaluate tools, open discussion, blogs, ?????, etc.

### Mention changes

Best practices/recommendations and examples are subect to change and will evolve over time.

## Contribute

Feel free to critique, ask questions and join the conversation, we'd love to hear your opinions and feedback. You can reach us by creating an issue on our [github](https://github.com/open-wc) or on the [#open-wc]() channel in the [Polymer slack]().

## FAQ
- [FAQ](/faq/)

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) uses all the above recommendations.
You can find a published storybook here: [https://example-set-game-open-wc.netlify.com/](https://example-set-game-open-wc.netlify.com/).
