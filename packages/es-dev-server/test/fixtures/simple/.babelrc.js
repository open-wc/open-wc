module.exports = {
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
  ],
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": [
          "ie 11"
        ],
        "useBuiltIns": false
      }
    ]
  ]
};