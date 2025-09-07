// apps/main/tsup.config.ts
import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: { main: "src/main.ts" },
    outDir: "dist",
    format: ["cjs"],
    target: "es2022",
    platform: "node",
    sourcemap: true,
    splitting: false,
    clean: false,
    shims: false,
    // WICHTIG: Electron & native Module NICHT bundlen
    external: ["electron", "original-fs", "better-sqlite3"],
    minify: false
  },
  {
    entry: { preload: "src/preload.ts" },
    outDir: "dist",
    format: ["cjs"],
    target: "es2022",
    platform: "node",
    sourcemap: true,
    splitting: false,
    clean: false,
    shims: false,
    // WICHTIG: auch im Preload nichts von native Modulen bundlen
    external: ["electron", "original-fs", "better-sqlite3"],
    minify: false
  }
])
