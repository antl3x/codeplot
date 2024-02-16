#!/usr/bin/env zx
import pkg from "../package.json" with { type: "json" };

await $`
rm -rf _tmp && mkdir _tmp

pnpm -w sops decrypt _cue/!base.enc* _cue/*@localhost.enc*

cue export \
    -t VITE_NPM_VERSION=${pkg.version} \
    _cue/* --expression generateEnvVariablesLocalhostFile --out text > _tmp/.env
export $(cat _tmp/.env | xargs)

vite
`;
