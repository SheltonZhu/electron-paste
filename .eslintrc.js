module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  env: {
    browser: true,
    node: true
  },
  extends: ["plugin:vue-libs/recommended","prettier"],
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  },
}
