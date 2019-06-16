export const indexHtml = `<html>
  <head>
    <title>foo</title>
  </head>
  <body>
    bar
  </body>
</html>
`;

export const indexHtmlWithImportMap = `<html>
  <head>
    <title>foo</title>
    <script type="importmap">
      {
        "imports": {
          "a": "a"
        }
      }
    </script>
  </head>
  <body>
    bar
  </body>
</html>
`;
