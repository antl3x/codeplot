import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    sourcemap: true,
    entry: ["./src/main.ts"],
    bundle: true,
    dts: true,
    format: ["esm"],
    outDir: "dist",
  },
]);
