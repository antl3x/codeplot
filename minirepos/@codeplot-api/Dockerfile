FROM node:20

# Set the working directory inside the container
WORKDIR /opt

RUN mkdir -p /opt/minirepos/@codeplot-shared
RUN mkdir -p /opt/minirepos/@codeplot-api

RUN npm install -g pnpm@8.14.1
COPY pnpm-workspace.yaml ./
COPY package.json ./

RUN pnpm install

COPY minirepos/@codeplot-shared/dist /opt/minirepos/@codeplot-shared/dist
COPY minirepos/@codeplot-shared/package*.json /opt/minirepos/@codeplot-shared

COPY minirepos/@codeplot-api/package*.json /opt/minirepos/@codeplot-api

WORKDIR /opt/minirepos/@codeplot-api
RUN pnpm install

COPY minirepos/@codeplot-api/_scripts /opt/minirepos/@codeplot-api/_scripts
COPY minirepos/@codeplot-api/dist /opt/minirepos/@codeplot-api/dist

EXPOSE 9107

# Define the command to run your app using CMD which defines your runtime
CMD [ "pnpm", "server.start" ]
