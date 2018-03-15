######################
### STAGE 1: Build ###
FROM node:8-alpine as builder

RUN apk update && apk add git python make g++ patch

WORKDIR /usr/src/app
COPY . .
RUN yarn install && yarn build

######################
### STAGE 2: Setup ###
FROM node:8-alpine

# Install app dependencies
WORKDIR /usr/src/app
COPY package.json package.json

# Bundle pre-built app
COPY ormconfig.prod.json ormconfig.json
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/node_modules node_modules

EXPOSE 3000
ENTRYPOINT yarn migrations && yarn start
