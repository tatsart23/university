// .eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended", // Use ESLint's recommended rules
    "plugin:react/recommended", // React-specific linting rules
    "plugin:react-hooks/recommended", // React Hooks rules
    "plugin:jsx-a11y/recommended", // Accessibility rules for JSX
    "plugin:import/errors", // Import error checking
    "plugin:import/warnings", // Import warning checking
  ],
  parser: "@babel/eslint-parser", // Use Babel parser to handle JSX and ES6+ syntax
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
  },
  plugins: [
    "react", // React plugin
    "react-hooks", // React Hooks plugin
    "jsx-a11y", // Accessibility plugin
    "import", // Import plugin for managing imports
  ],
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "react/jsx-uses-react": "on",
    "react/react-in-jsx-scope": "off",
    "import/no-unresolved": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
