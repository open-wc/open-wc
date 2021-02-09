const componentLibraries = [
  {
    name: 'aybolit',
    url: 'https://web-padawan.github.io/aybolit/',
    description:
      'A growing family of elements with default styling for Bootstrap, Bulma, and Material, as well as a solid white-label basis for extending the underlying functionality with your own custom designs.',
  },
  {
    name: 'Auro',
    url: 'https://auro.alaskaair.com',
    description:
      "The Auro Design System and by extension, Auro Web Components are the core components for a new cross-team, multi-platform development strategy to ensure consistency of UI and experience for all of Alaska's customers. Auro is an eco-system of design, core utilities, and web components designed to reduce design and development efforts.",
  },
  {
    name: 'Bolt',
    url: 'https://boltdesignsystem.com/',
    description:
      'A family of web components built with first-class participation in the Twig templating system for PHP in mind. This set is backed by an expansive catalog of usage variants.',
  },
  {
    name: 'Carbon Design System',
    url: 'https://github.com/carbon-design-system/carbon-custom-elements',
    description:
      'Carbon is an open-source design system built by IBM. With the IBM Design Language as its foundation, the system consists of working code, design tools and resources, human interface guidelines, and a vibrant community of contributors.',
  },
  {
    name: 'Clever Components',
    url: 'https://github.com/CleverCloud/clever-components',
    description:
      'A collection of low-level (atoms) and high-level (domain specific) Web Components made by Clever Cloud for its different Web UIs (public and internal).',
  },
  {
    name: 'Crayons by Freshworks',
    url: 'https://crayons.freshworks.com',
    description:
      'Crayons is a web component library for developers who build apps for Freshworks. Through pre-built components, Crayons offers control and flexibility to build rich interfaces consistent with the Freshworks product design and experience.',
  },
  {
    name: 'Elix',
    url: 'https://component.kitchen/elix',
    description:
      'The Elix project aims to create a universal library of all general-purpose user interface patterns commonly found in desktop and mobile UIs, where each pattern is implemented as a well-designed, attractive, high-quality, performant, accessible, localizable, and extensively customizable web component.',
  },
  {
    name: 'FAST',
    url: 'https://fast.design',
    description:
      'FAST is a web component library built by Microsoft. The core, `fast-element`, is a lightweight means to easily build performant and standards-compliant Web Components. `fast-foundation` is a library of Web Component classes, templates, and other utilities built on fast-element intended to be composed into registered web components by design systems.',
  },
  {
    name: 'HelixUI',
    url: 'https://helixdesignsystem.github.io/helix-ui/',
    description:
      'The HelixUI library provides front-end developers a set of reusable CSS classes and HTML Custom Elements that adhere to Helix design standards, as outlined by Rackspace.',
  },
  {
    name: 'Ink Components',
    url: 'https://components.ink/',
    description:
      'Web components for interactive scientific writing, reactive documents and explorable explanations. The Ink Components library can bring your math and science documents to the next level by breathing life into charts, equations, and variables that can be used throughout your application or content.',
  },
  {
    name: 'Io GUI',
    url: 'https://io-gui.dev/#page=elements',
    description:
      'Io is a UI framework for web applications and custom elements. It supports virtual DOM, reactive rendering and data binding. It includes a design system composed of UI elements ranging from simple input fields, to menu systems and responsive layouts. Its unique feature is the ability to create visually complex, yet fast and GPU-optimized elements using WebGL shaders.',
  },
  {
    name: 'Ionic UI Components',
    url: 'https://ionicframework.com/docs/components',
    description:
      'Take advantage of the component system that powers Ionic applications with a large ecosystem to choose from and in-depth usage instructions, no matter the framework you use.',
  },
  {
    name: 'iooxa.dev',
    url: 'https://iooxa.dev/',
    description:
      'The goal of [iooxa.dev](https://iooxa.dev/) is to provide open source tools to promote and enable interactive scientific writing, reactive documents and explorable explanations.',
  },
  {
    name: 'Kor UI',
    url: 'https://kor-ui.com/',
    description:
      'A Design System and complete UI component library built to facilitate the design and development of intuitive, coherent and pleasing applications based on Web technologies (HTML5). It contains 35+ components which are compatible with any framework, form factor, input type and modern browser.',
  },
  {
    name: 'Lightning Web Components by SalesForce',
    url: 'https://developer.salesforce.com/docs/component-library/overview/components',
    description:
      'Lightning Web Components are now the go-to standard for developing applications in the SalesForce ecosystem, and with the power of web components, they can be the basis of applications outside of their ecosystem, too!',
  },
  {
    name: 'Lion Web Components by ING Bank',
    url: 'https://github.com/ing-bank/lion',
    description:
      'Lion web components is a set of highly performant, accessible and flexible Web Components. They provide an unopinionated, white label layer that can be extended to your own layer of components.',
  },
  {
    name: 'Material Web Components',
    url:
      'https://material-components.github.io/material-components-web-components/demos/index.html',
    description:
      "Material Design Components from Material Design team themselves. Stay as close as possible to the changing specification with these components from Google's own Material Design team.",
  },
  {
    name: 'Shoelace',
    url: 'https://shoelace.style/',
    description:
      'Shoelace provides a collection of professionally designed, every day UI components built on a framework-agnostic technology. Every web component is built with accessibility and developer experience in mind.',
  },
  {
    name: 'Smart HTML Elements',
    url: 'https://www.htmlelements.com',
    description:
      'With the goal of helping to deliver modern responsive websites and applications that work on any device and are pleasure to use, the Smart HTML Elements collection is one the most feature rich and comprehensive javascript user interface frameworks.',
  },
  {
    name: 'Spectrum Web Components',
    url: 'https://opensource.adobe.com/spectrum-web-components/',
    description:
      "The Spectrum Web Components project is an implementation of Spectrum, Adobe’s design system. It's designed to work with any web framework — or even without one.",
  },
  {
    name: 'UI5 Web Components',
    url: 'https://sap.github.io/ui5-webcomponents/',
    description:
      "Get the power and flexibility of SAP's UI5 rendering stack with the ergonomics and ease of use of web components, and bring enterprise-grade features, Fiori UX and themeability home to your application.",
  },
  {
    name: 'Vaadin',
    url: 'https://vaadin.com/components',
    description:
      'Vaadin has a comprehensive set of beautifully crafted, performant, and adaptable UI components for modern mobile-first Web apps. They are the ideal building blocks for Progressive Web Applications.',
  },
  {
    name: 'Weightless',
    url: 'https://weightless.dev/',
    description:
      'A lightweight component library featuring a wide array of design concepts. It surfaces a good amount of customizability via comprehensive component and CSS Custom Property APIs with a small footprint, just short of 30KB.',
  },
  {
    name: 'Wired Elements',
    url: 'https://wiredjs.com/',
    description:
      'A set of common UI elements with a hand-drawn, sketchy look. These can be used for wireframes, mockups, or just the fun hand-drawn look.',
  },
  {
    name: 'Zooplus Web Components',
    url: 'https://zooplus.github.io/zoo-web-components/',
    description: 'A set of web components that implement Z+ shop style guide.',
  },
];

module.exports = async function getComponentLibraries() {
  return componentLibraries.sort((a, b) => a.name.localeCompare(b.name));
};
