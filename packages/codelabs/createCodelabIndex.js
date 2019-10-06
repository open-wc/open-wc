function createStep(step) {
  return `
    <google-codelab-step label="${step.heading}">
<<<<<<< HEAD

    ${step.html}

=======
    ${step.html}
>>>>>>> feat(codelabs): add codelabs
    </google-codelab-step>
  `;
}

module.exports = function createIndex(codelab) {
  return `
    <!doctype html>

    <html>
    <head>
      <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
      <meta name="theme-color" content="#4F7DC9">
      <meta charset="UTF-8">
      <title>${codelab.heading}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400|Roboto:400,300,400italic,500,700|Roboto+Mono">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
      <link rel="stylesheet" href="https://storage.googleapis.com/codelab-elements/codelab-elements.css">
      <style>
        .success {
          color: #1e8e3e;
        }
        .error {
          color: red;
        }
      </style>
    </head>

    <body>
<<<<<<< HEAD

=======
>>>>>>> feat(codelabs): add codelabs
      <google-codelab title="${
        codelab.heading
      }" feedback-link="https://github.com/open-wc/open-wc/issues">

<<<<<<< HEAD
        ${codelab.steps.map(createStep).join('')}
=======
        ${codelab.steps.map(createStep)}
>>>>>>> feat(codelabs): add codelabs

      </google-codelab>

      <script src="https://storage.googleapis.com/codelab-elements/native-shim.js"></script>
      <script src="https://storage.googleapis.com/codelab-elements/custom-elements.min.js"></script>
      <script src="https://storage.googleapis.com/codelab-elements/prettify.js"></script>
      <script src="https://storage.googleapis.com/codelab-elements/codelab-elements.js"></script>

    </body>
    </html>
  `;
};
