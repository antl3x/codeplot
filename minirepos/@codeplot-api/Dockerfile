FROM node:20

# Set the working directory inside the container
WORKDIR /opt/@codeplot-api

RUN npm install -g pnpm@8.14.1
COPY package*.json ./


RUN pnpm install

COPY _scripts _scripts/
COPY dist/ dist/

EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "pnpm", "server.start" ]
