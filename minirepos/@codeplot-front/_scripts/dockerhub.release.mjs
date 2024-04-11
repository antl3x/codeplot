#!/usr/bin/env zx
import pkg from "../package.json" with { type: "json" };

await $`
export VITE_TARGET=selfhost
echo "$CODEPLOT_DOCKER_ACCESS_TOKEN" | docker login --username "codeplotco" --password-stdin

pnpm compile

# Build and push the multi-architecture image
docker buildx build -t codeplotco/codeplot-front:latest --platform linux/amd64,linux/arm64 --push .

# Extract the package version and the short git commit hash
PKG_VERSION=$(grep 'version' package.json | cut -d '"' -f 4)
GIT_COMMIT_HASH=$(git rev-parse --short HEAD)

# Tag and push the versioned image
docker buildx build -t codeplotco/codeplot-front:$PKG_VERSION --platform linux/amd64,linux/arm64 --push .
docker buildx build -t codeplotco/codeplot-front:$PKG_VERSION-$GIT_COMMIT_HASH --platform linux/amd64,linux/arm64 --push .
`;
