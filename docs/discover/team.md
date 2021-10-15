---
layout: layout-default
templateEngineOverride: njk,md
members:
  - name: Thomas Allmer
    github: daKmoR
    twitter: daKmoR
    bio:

  - name: Lars Den Bakker
    github: LarsDenBakker
    twitter: LarsdenBakker18
    bio:

  - name: Westbrook Johnson
    github: Westbrook
    twitter: WestbrookJ
    bio: >-
      As a Senior Computer Scientist at Adobe, Westbrook leads the [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components) project. As a member of the broader web community, he is the chairperson of the w3c's [Web Components Community Group](https://www.w3.org/community/webcomponents/).

  - name: Benny Powers
    github: bennypowers
    twitter: PowersBenny
    bio: >-
      Principal front-end developer at Red Hat, working on [PatternFly Elements](https://patternflyelements.org/) web components,
      and long-time web-technologies enthusiast. Benny is the maintainer of [Apollo Elements](https://apolloelements.dev),
      `rollup-plugin-lit-css`, and other web-components related projects. Benny lives in Jerusalem,
      Israel with his wife and daughters.

  - name: Pascal Schilp
    github: thepassle
    twitter: passle_
    bio: Software engineer at ING
---

# Team

Open Web Components is an international, volunteer organization of web professionals
interested in platform-centric development with web components.
In addition to our core members, Open Web Components could not function without numerous contributors.

## Core Members

<owc-team>

{% for member in members %}
<owc-member>

### {{ member.name }}

{{ member.bio | safe }}

<footer>
  {%- if member.github -%}
  <a href="https://github.com/{{ member.github }}" rel="noopener noreferer" target="_blank">
    {%- include '../_merged_assets/brand-logos/github.svg' -%}
  </a>
  {%- endif -%}
  {%- if member.twitter -%}
  <a href="https://twitter.com/{{ member.twitter }}" rel="noopener noreferer" target="_blank">
    {% include '../_merged_assets/brand-logos/twitter.svg' %}
  </a>
  {%- endif -%}
</footer>

</owc-member>

{% endfor %}

</owc-team>

<style data-helmet>
.markdown-body owc-team {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  grid-template-rows: masonry;
}

.markdown-body owc-member {
  border: 1px solid var(--primary-lines-color);
  border-radius: 6px;
  background-color: var(--footer-background);
  padding: 10px 22px;
}

.markdown-body owc-member h3 {
  margin-block: 0.5em;
}

.markdown-body owc-member footer {
  display: flex;
  gap: 12px;
  background-color: transparent;
  justify-content: end;
}

.markdown-body owc-member footer a {
  height: 40px;
  width: 40px;
  color: inherit;
}

.markdown-body owc-member footer img {
  width: 100%;
  height: 100%;
}
</style>
