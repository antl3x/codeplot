#!/usr/bin/env zx

await $`
node_modules/.bin/tsup src/index.ts --format cjs,esm --dts
`;
