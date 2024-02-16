#!/usr/bin/env zx
import pkg from "../package.json" with { type: "json" };

await $`
rm -rf _tmp && mkdir _tmp
pnpm -w sops decrypt _cue/!base.enc* _cue/*@localhost.enc*

cue export _cue/* \
    -t VITE_NPM_VERSION=${pkg.version} \
    --expression generateEnvVariablesLocalhostFile --out text > _tmp/.env
cue export _cue/* \
    -t VITE_NPM_VERSION=${pkg.version} \
    --expression dockerComposeLocalhost --out yaml > _tmp/docker-compose.yaml

export $(cat _tmp/.env | xargs)

pnpm compile

docker context use $DOCKER_CONTEXT
docker build -t $DOCKER_IMAGE .
docker compose --file ./_tmp/docker-compose.yaml up
`;
