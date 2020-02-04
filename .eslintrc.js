module.exports = {
  extends: "airbnb-base",
  env: {
    jest: true
  },
  rules: {
    semi: ["error", "never"],
    // "comma-dangle": ["warn", "always-multiline"]
    "no-underscore-dangle": "off"
  }
};
