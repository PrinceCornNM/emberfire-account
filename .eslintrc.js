module.exports = {
  root: true,
  parserOptions: {
<<<<<<< HEAD
    ecmaVersion: 8,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  plugins: [
    "promise"
  ],
  rules: {
    "promise/always-return": "error",
    "promise/avoid-new": "off",
    "promise/catch-or-return": "error",
    "promise/no-callback-in-promise": "warn",
    "promise/no-native": "off",
    "promise/no-nesting": "error",
    "promise/no-promise-in-callback": "warn",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/prefer-await-to-callbacks": "error",
    "promise/prefer-await-to-then": "error"

=======
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
>>>>>>> fa3a27c... diff
  }
};
