import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Registry source-of-truth blocks contain literal {{slot}} tokens that
    // are substituted at scaffold time by the venture-os catalog resolver.
    // They are not compiled in-place — exclude from lint/typecheck.
    "registry/**",
  ]),
]);

export default eslintConfig;
