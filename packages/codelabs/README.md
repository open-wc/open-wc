# Open-wc codelabs

## Contributing

Codelabs are written in markdown, h1 (`#`) indicates the codelab title and each h2 (`##`) indicates a codelab step. You can embed links, images and code snippets. See `example-codelabs` for more info.

To display notifications, you can use a aside:

```html
<aside class="notice">...</aside>
```

Possibles classes are: notice, special, warning, callout

You can view the result of a codelab by running the codelab build. This will output the codelab index.html under `/docs/.vuepress/public/codelabs`. You can open it with any browser.

Codelabs are output using the Google Codelab tools. See https://github.com/googlecodelabs/tools for the full documentation.
