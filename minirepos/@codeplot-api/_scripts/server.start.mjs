#!/usr/bin/env zx

console.log(`Starting server in ${process.env.TARGET} mode...`);

if (process.env.TARGET === "production") {
  await $`node ./dist/main.cjs`;
}

if (process.env.TARGET === "localhost") {
  await $`node_modules/.bin/nodemon --watch ./dist/** --exec "node ./dist/main.cjs"`;
}
