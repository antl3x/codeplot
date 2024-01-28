package base

// traefikLabels: {
//     "traefik.enable": "true",
//     "traefik.http.routers.web.entrypoints": "web",
//     "traefik.http.routers.websecure.entrypoints": "websecure",
//     "traefik.http.routers.websecure.tls.certresolver": "myresolver",
//     "traefik.http.services.codeplot-co.loadbalancer.server.port": "80",
// }

envVariables: {
    TARGET: string,
    DOCKER_CONTEXT: string,
    DOCKER_IMAGE: string,
    PORT_CONTAINER: string,
    PORT_HOST: string,
}

