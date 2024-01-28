package base
import "strings"

dockerComposeLocalhost: {
    services: {
        "codeplot-api": {
            image: envVariablesLocalhost.DOCKER_IMAGE
            environment: envVariablesLocalhost
            ports: [
                "\(envVariablesLocalhost.PORT_HOST):\(envVariablesLocalhost.PORT_CONTAINER)"
            ]
            volumes:
                ["../dist:/opt/@codeplot-api/dist"]
        }
    }
}

// Development configuration
envVariablesLocalhost: envVariables & {
    TARGET: "localhost"
    DOCKER_CONTEXT: "default"
    DOCKER_IMAGE: "codeplot-api:localhost"
    PORT_CONTAINER: "3000"
    PORT_HOST: "9107"
}

generateEnvVariablesLocalhostFile: strings.Join([for k, v in envVariablesLocalhost if !strings.HasPrefix(k, "_") { "\(k)=\(v)" }], "\n")
generatePublicEnvVariablesLocalhostFile: strings.Join([for k, v in envVariablesLocalhost if strings.HasPrefix(k, "PUBLIC_") { "\(k)=\(v)" }], "\n")