import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import js from "@eslint/js";
const normalize = (cfg) => (Array.isArray(cfg) ? cfg : [cfg]);

const configArray = [
  ...normalize(js.configs.recommended),
  ...normalize(typescriptEslint.configs["flat/eslint-recommended"]),
  ...normalize(typescriptEslint.configs["flat/recommended"]),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
            serverRoot: "readonly",
            appRoot: "readonly",
            testRoot: "readonly",
            sinon: "writable",
            expect: "writable",
            should: "writable",
            chaiAsPromised: "writable",
            request: "writable",
            describe: "writable",
            beforeEach: "writable",
            afterEach: "writable",
            it: "writable",
        },
        ecmaVersion: 8,
        sourceType: "script",
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      semi: ["error", "always"],
      "arrow-spacing": "error",

      "brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: true,
        },
      ],

      "comma-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],

      curly: "error",
      eqeqeq: "error",
      "eol-last": ["warn", "always"],

      indent: [
        "error",
        2,
        {
          FunctionExpression: {
            parameters: "first",
          },

          CallExpression: {
            arguments: "first",
          },

          outerIIFEBody: 2,
          SwitchCase: 2,
          offsetTernaryExpressions: true,
        },
      ],

      "key-spacing": [
        "error",
        {
          afterColon: true,
        },
      ],

      "keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],

      "no-duplicate-imports": "error",
      "no-irregular-whitespace": "error",
      "no-trailing-spaces": "error",
      "no-multi-spaces": "error",

      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
        },
      ],

     "no-underscore-dangle": "off",
     "@typescript-eslint/no-unused-expressions": "off",
      "no-whitespace-before-property": "error",
      "object-curly-spacing": ["error", "always"],
      "require-await": "error",
      "space-infix-ops": "error",
    },
  },
  {
    files: ["test/*.js", "test/**/*.js"],
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
    },
}
];

export default configArray;
