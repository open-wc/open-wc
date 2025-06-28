const componentLibraries = [
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
    name: 'Calcite Design System',
    url: 'https://developers.arcgis.com/calcite-design-system/',
    description:
      'Calcite Design System is a collection of design and development resources for creating beautiful, easy to use, cohesive experiences across apps with minimal effort. It includes a UI kit, icons, color schemes, and a web component library with UI elements such as buttons, panels, accordions, alerts, and many more.',
  },
  {
    name: 'Carbon Design System',
    url: 'https://github.com/carbon-design-system/carbon-web-components',
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
    name: 'curvenote.dev',
    url: 'https://curvenote.dev/',
    description:
      'The goal of curvenote.dev is to provide open source tools to promote and enable interactive scientific writing, reactive documents and explorable explanations.',
  },
  {
    name: 'Dile',
    url: 'https://dile-components.polydile.com/',
    description: 'Custom elements made for all kind of projects and frameworks.',
  },
  {
    name: 'drab',
    url: 'https://drab.robino.dev',
    description:
      'drab is a headless, SSR friendly, custom element library that utilizes the light DOM to enhance HTML.',
  },
  {
    name: 'Duet Design System',
    url: 'https://www.duetds.com/',
    description:
      'Duet is a collection of reusable components and tools, guided by clear standards, that can be assembled together to build digital products for LocalTapiola and Turva.',
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
    name: 'Graphite Design System',
    url: 'https://graphitedesignsystem.com',
    description:
      "Graphite is PAQT's white-label design system for digital products and experiences. The system consists of working code, design kits, and human interface guidelines.",
  },
  {
    name: 'HelixUI',
    url: 'https://helixdesignsystem.github.io/helix-ui/',
    description:
      'The HelixUI library provides front-end developers a set of reusable CSS classes and HTML Custom Elements that adhere to Helix design standards, as outlined by Rackspace.',
  },
  {
    name: 'Ignite UI for Web Components',
    url: 'https://github.com/IgniteUI/igniteui-webcomponents',
    description:
      'Ignite UI for Web Components is a complete library of UI components, giving you the ability to build modern web application UIs. All components are based on the Indigo.Design Design System and are backed by ready-to-use UI kits for Sketch, Adobe XD and Figma.',
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
    name: 'Kor UI',
    url: 'https://kor-ui.com/',
    description:
      'A Design System and complete UI component library built to facilitate the design and development of intuitive, coherent and pleasing applications based on Web technologies (HTML5). It contains 35+ components which are compatible with any framework, form factor, input type and modern browser.',
  },
  {
    name: 'LDRS',
    url: 'https://uiball.com/ldrs/',
    description: 'A meticulously designed set of lightweight, configurable loaders and spinners.',
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
    name: 'LRNWebcomponents',
    url: 'https://webcomponents.psu.edu',
    description:
      'Developed by Penn State University, LRNWebcomponents is home to hundreds of reusable, generalized components, as well as full web editors and CMSs like HAX and HAXcms. Highly accessible video players, collapses, color abstractions and more can be found here',
  },
  {
    name: 'Material web (MWC)',
    url: 'https://github.com/material-components/material-web',
    description:
      "Material Design Components from Material Design team themselves. Stay as close as possible to the living specification with these components from Google's own Material Design team.",
  },
  {
    name: 'mdui',
    url: 'https://www.mdui.org/',
    description: 'A Material Design 3 (Material You) library of Web Components.',
  },
  {
    name: 'Nord Design System',
    url: 'https://nordhealth.design/components/',
    description:
      'Nord Design System is a collection of reusable components and tools, guided by clear standards, that can be assembled together to build digital products and experiences.',
  },
  {
    name: 'Patternfly Elements',
    url: 'https://patternflyelements.org/',
    description: "Red Hat's set of community-created web components based on PatternFly design.",
  },
  {
    name: 'Porsche Design System',
    url: 'https://designsystem.porsche.com/',
    description:
      'The Porsche Design System provides the design fundamentals and elements for efficiently creating aesthetic and high-quality web applications, including easy-to-use Figma and UX Pin libraries, coded Web Components and comprehensive usage guidelines. Everything is built and tested following the Porsche quality standards and corporate design principles.',
  },
  {
    name: 'Siemenx IX',
    url: 'https://ix.siemens.io/',
    description:
      'Siemens Industrial Experience is an open-source design system for designers and developers to consistently create the perfect digital experience for partners and customers.',
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
    name: 'Vivid',
    url: 'https://github.com/Vonage/vivid',
    description:
      "Vonage's web UI 🎨 toolbelt. A library that favors lock-down and coherence over white labeling strategy, utilizing high-level design tokens to customize UI systematically rather than permuting components directly (to a balanced degree).",
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
