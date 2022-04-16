module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  ignorePatters: ["models/Telegram.js"],
  rules: {
    "quotes": ["error", "double"],
    "linebreak-style": 0,
    "indent": ["error", 2, {
      "ignoredNodes": [
        "ObjectExpression",
      ],
    }],
    "no-unused-vars": "warn",
    "no-trailing-spaces": ["warn", {
      "skipBlankLines": true,
      "ignoreComments": true,
    }],
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
};
