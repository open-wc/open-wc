# Community >> Base Libraries ||20

## Resources

- [All the ways to build a web component](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/) a comparison of different web component libraries.

- [awesome lit-html](https://github.com/web-padawan/awesome-lit-html) a collection of resources related to lit-html, lit-element and general web components.

## Base libraries

Our generator sets you up with a component built with [lit-html](http://lit-html.polymer-project.org/) and [lit-element](https://lit-element.polymer-project.org/) as base libraries. We recommend this as a general starting point. `lit-html` and `lit-element` have a strong community, making it easy to find help and examples. It is actively maintained and creates a good balance between performance, developer experience and feature richness.

Other base libraries excel at other points and could be a great fit for for your project as well. Below we show a listing of base libraries sorted by weekly NPM downloads. This is a very rough metric, and should not be the only means of judging the quality of a project.

<ul>
{% for lib in baseLibraries %}
  <li>
     <a href="{{ lib.url }}" target="_blank" rel="noopener noreferrer">{{ lib.name }}</a> ({{ lib.downloadsFormatted }} weekly downloads)
     <p>{{ lib.description }}</p>
  </li>
{% endfor %}
</ul>

<!-- The data for this list is maintained in /docs/_data/baseLibraries.js -->

> Note: want to add another base library to this list? Send us a pull request!
