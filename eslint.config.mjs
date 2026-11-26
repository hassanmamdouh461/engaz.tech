import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // Build scripts run in Node, not the browser.
  { files: ["scripts/**"], languageOptions: { globals: globals.node } },
  globalIgnores(["dist/**", ".astro/**", "node_modules/**", ".wrangler/**"]),
]);
