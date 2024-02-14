import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    sourcemap: true,
    entry: ["./src/**/*.ts"],
    bundle: true,
    dts: true,
    format: ["esm"],
    outDir: "dist/esm",
    esbuildOptions(options) {
      options.outbase = "./src";
    },
  },
  {
    clean: true,
    sourcemap: true,
    entry: ["./src/index.ts"],
    dts: true,
    bundle: true,
    format: ["cjs"],
    outDir: "dist/cjs",
    esbuildOptions(options) {
      options.outbase = "./src";
    },
  },
]);
