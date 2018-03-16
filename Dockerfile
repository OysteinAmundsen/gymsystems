######################
### STAGE 1: Build ###
FROM node:8-alpine as builder

WORKDIR /usr/src/app

# Copy in source
COPY tsconfig.json .snyk .angular-cli.json yarn.lock ./
COPY src ./src

# Install packages
COPY package.json ./
RUN npm install

# Build to `dist`
RUN npm run build

# Cleanup! Replace node_modules with production modules
RUN rm -rf node_modules src
RUN npm install --production

######################
### STAGE 2: Setup ###
FROM node:8-alpine

# Install app dependencies
WORKDIR /usr/src/app

# Bundle pre-built app
COPY --from=builder /usr/src/app ./
COPY ormconfig.prod.json ormconfig.json

# Rebuild bcrypt to avoid segfault
RUN apk update ; \
    apk add python make g++; \
    npm rebuild bcrypt --build-from-source ;

EXPOSE 3000
ENTRYPOINT npm run migrations && npm run start
