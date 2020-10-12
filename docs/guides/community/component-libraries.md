# Community >> Component Libraries ||30

The hardest part of any project is often getting content onto that first blank page. To make it easier to get your app off the ground quickly, we've collected a list of design systems which are based on web-components from which you can acquire elements or inspiration.

<ul>
{% for lib in componentLibraries %}
  <li>
     <a href="{{ lib.url }}" target="_blank" rel="noopener noreferrer">{{ lib.name }}</a>
     <p>{{ lib.description }}</p>
  </li>
{% endfor %}
</ul>

<!-- The data for this list is maintained in /docs/_data/componentLibraries.js -->

> Note: want to add another component library to this list? Send us a pull request!
