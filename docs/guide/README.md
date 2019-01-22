# Introduction

The goal of Open Web Components is to empower everyone with a powerful and battle-tested setup for sharing open source web components. We try to achieve this by giving a set of recommendations and defaults on how to facilitate your web component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

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

## Why `open-wc`

We want to provide the community with well-known and experience-tested recommendations for their web component projects. Everything we do here is to encourage and support development with these open standards.

### Our Philosophy

The goal of Open Web Components is to empower developers with powerful and battle-tested tools for creating and sharing open source web components.

Many web developers have experienced the dreaded "Javascript Fatigue". With our recommendations, we hope you'll enjoy the peace of mind that comes from having a well-known default solution for almost everything. From IDE to CI, `open-wc` has got you covered.

We want web component development to be accessible and approachable for everyone, regardless of their background. Therefore, our recommendations aim to be easy to use, be ready to use, and provide that "it just works" developer experience we all crave for the various aspects of web component development

### Why Web Components

We believe that the open web is an ideal platform for application development. It's free, open, and standardized nature reenforces user's privacy and control while enabling developers to produce useful apps.

#### Historical Background

**tl;dr:** Libraries provided the inspiration to standardize the web's component model, which became a practical reality in 2019 after many years of work.

The World Wide Web was originally just text documents connected by hyperlinks. As technologies like JavaScript and techniques like <abbr title="Asynchronous JavaScript and XML">AJAX</abbr> and <abbr title="Representational State Transfer">REST</abbr> entered the picture, the web slowly developed into a platform for full-fledged application development.

At first, JavaScript libraries like jQuery were absolutely required. jQuery gave developers a common set of tools across browsers with extremely different feature sets. Eventually jQuery features became standard browser features. The pattern of libraries innovating and browsers subsequently standardizing continued. As the "[browser wars](https://www.wikiwand.com/en/Browser_wars)" died down, the pace of standardization increased, and many new features came to the web.

In the last several years, a component-based model for web app development became popular, and the JavaScript community blossomed with a wide variety of libraries and approaches. Work on standardizing the web's component model began at Google in 2012. After several years of open development, the web components standards became implemented across all major browsers in 2019.

#### Technical Benefits

What if you could remove code, gain performance, and streamline implementation across everything you build? Web components provide this through the power of subtraction.

- Replace JavaScript you'd normally need to include by letting the browser handle things like [templating](https://www.w3.org/TR/html5/semantics-scripting.html#the-template-element), [style scoping](https://www.w3.org/TR/dom41/#shadow-trees), and [component model](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements).
- Increase your app's performance.
- Write using a streamlined component API that combines the best bits of popular libraries and frameworks!

##### Performance
Just like `querySelector` reduces developers' dependence on jQuery, the web components standards reduces the size and complexity of component libraries and frameworks. This ultimately benefits users by decreasing page load times and increasing app performance.

##### Future Proofing
Using the browser's standards-based component model will increase the longevity of your application by protecting it from framework churn. The web has an extremely strong tradition of backwards-compatibility. Standards bodies have consistently gone out of their way to maintain legacy APIs.

##### Flexibility
The web components standards are fairly low-level, letting library authors build upon them with innovative APIs. By using such libraries you can build your app in the style you want while still leveraging built-in browser features.

### How We Work

	- Polymer slack, evaluate tools, open discussion, blogs, ?????, etc.

### Mention Changes

Best practices/recommendations and examples are subject to change and will evolve over time.

## Contribute

Feel free to critique, ask questions and join the conversation, we'd love to hear your opinions and feedback. You can reach us by creating an issue on our [github](https://github.com/open-wc) or on the [#open-wc]() channel in the [Polymer slack]().

## FAQ
- [FAQ](/faq/)

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) uses all the above recommendations.
You can find a published storybook here: [https://example-set-game-open-wc.netlify.com/](https://example-set-game-open-wc.netlify.com/).
