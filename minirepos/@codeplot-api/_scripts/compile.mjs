#!/usr/bin/env zx

await $`
rm -rf dist
pnpm --filter @codeplot/api^... compile
node_modules/.bin/tsup
`;
