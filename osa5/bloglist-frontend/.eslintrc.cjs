// .eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',         // Use ESLint's recommended rules
    'plugin:react/recommended',   // React-specific linting rules
    'plugin:react-hooks/recommended',  // React Hooks rules
    'plugin:jsx-a11y/recommended',     // Accessibility rules for JSX
    'plugin:import/errors',       // Import error checking
    'plugin:import/warnings',     // Import warning checking
  ],
  parser: '@babel/eslint-parser',  // Use Babel parser to handle JSX and ES6+ syntax
  parserOptions: {
    ecmaVersion: 12,               // Set ECMAScript version to 2021 (ES12)
    sourceType: 'module',          // Allow ES module syntax (import/export)
    ecmaFeatures: {
      jsx: true,                   // Enable JSX parsing
    },
  },
  plugins: [
    'react',       // React plugin
    'react-hooks', // React Hooks plugin
    'jsx-a11y',    // Accessibility plugin
    'import',      // Import plugin for managing imports
  ],
  rules: {
    'react/prop-types': 'off',          // Turn off prop-types rule (if you're using TypeScript or another method for type-checking)
    'no-unused-vars': 'warn',           // Warn about unused variables
    'no-console': 'warn',               // Warn about console.log statements
    'react/jsx-uses-react': 'off',      // Disable the rule that enforces React import in JSX files (React 17+ doesn't require it)
    'react/react-in-jsx-scope': 'off',  // Disable the rule that requires React to be in scope (React 17+ doesn't require it)
    'import/no-unresolved': 'error',    // Ensure all imports can be resolved
  },
  settings: {
    react: {
      version: 'detect',               // Automatically detect the React version to use
    },
  },
};
