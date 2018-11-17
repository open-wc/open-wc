module.exports = {
  extends: [
    'tslint:recommended',
    'tslint-config-airbnb',
    'tslint-immutable',
  ],
  rules: {
    align: [true, 'members', 'parameters', 'statements'],
    'array-type': false,
    "function-name": [
      true,
      {
        "method-regex": "^[a-z][\\w\\d]+$",
        "private-method-regex": "^_+[a-z][\\w\\d]+$",
        "protected-method-regex": "^[a-z][\\w\\d]+$",
        "static-method-regex": "^[A-Z_\\d]+$",
        "function-regex": "^[a-z][\\w\\d]+$"
      }
    ],
    'import-name': false,
    'interface-name': [true, 'never-prefix'],
    'no-console': false,
    'no-debugger': false,
    'no-duplicate-imports': false,
    'no-object-literal-type-assertion': false,
    'object-literal-sort-keys': false,
    'ordered-imports': false,
    'strict-boolean-expressions': false,
    'trailing-comma': [
      true,
      {
        multiline: {
          arrays: 'always',
          functions: 'never',
          objects: 'always',
          typeLiterals: 'ignore'
        },
        esSpecCompliant: true,
      },
    ],
    "quotemark": [true, "single", "jsx-double"],
    "variable-name": [
      true,
      "ban-keywords",
      "check-format",
      "allow-leading-underscore",
      "allow-trailing-underscore",
      "allow-snake-case"
    ]
  },
};