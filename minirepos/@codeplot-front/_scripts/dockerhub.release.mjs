#!/usr/bin/env zx
import pkg from "../package.json" with { type: "json" };

await $`
export VITE_TARGET=selfhost
echo "$CODEPLOT_DOCKER_ACCESS_TOKEN" | docker login --username "codeplotco" --password-stdin

pnpm compile

docker build -t codeplotco/codeplot-front:latest .
docker tag codeplotco/codeplot-front:latest codeplotco/codeplot-front:${pkg.version}
docker tag codeplotco/codeplot-front:latest codeplotco/codeplot-front:${pkg.version}-$(git rev-parse --short HEAD)
docker push codeplotco/codeplot-front:latest
docker push codeplotco/codeplot-front:${pkg.version}
docker push codeplotco/codeplot-front:${pkg.version}-$(git rev-parse --short HEAD)
`;
