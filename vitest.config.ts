import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path in tsconfig.json, so tests can import modules that
    // use the alias themselves (seo.ts → content.ts → @/data/content.json).
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
