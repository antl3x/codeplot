#!/usr/bin/env zx

await $`
rm -rf _tmp && mkdir _tmp
pnpm -w sops decrypt _cue/!base.enc* _cue/*@production.enc*

cue export _cue/* --expression generateEnvVariablesProductionFile --out text > _tmp/.env
cue export _cue/* --expression dockerComposeProduction --out yaml > _tmp/docker-compose.yaml

export $(cat _tmp/.env | xargs)

pnpm compile

docker context use $DOCKER_CONTEXT
docker build -t $DOCKER_IMAGE --file Dockerfile ../../
docker compose --file ./_tmp/docker-compose.yaml up -d
`;
