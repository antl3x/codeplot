#!/usr/bin/env zx
import pkg from "../package.json" with { type: "json" };

await $`
echo "$CODEPLOT_DOCKER_ACCESS_TOKEN" | docker login --username "codeplotco" --password-stdin

pnpm compile

docker build -t codeplotco/codeplot-api:latest --file Dockerfile ../../
docker tag codeplotco/codeplot-api:latest codeplotco/codeplot-api:${pkg.version}
docker tag codeplotco/codeplot-api:latest codeplotco/codeplot-api:${pkg.version}-$(git rev-parse --short HEAD)
docker push codeplotco/codeplot-api:latest
docker push codeplotco/codeplot-api:${pkg.version}
docker push codeplotco/codeplot-api:${pkg.version}-$(git rev-parse --short HEAD)
`;
