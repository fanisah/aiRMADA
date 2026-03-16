import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import nextPlugin from "@next/eslint-plugin-next"
import { fixupPluginRules } from "@eslint/compat"

export default defineConfig([
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: {
      // fixupPluginRules mencegah circular reference saat plugin di-register
      "@next/next": fixupPluginRules(nextPlugin),
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // Next.js recommended + core-web-vitals rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },

  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
])
