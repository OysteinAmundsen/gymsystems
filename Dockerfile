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

# In order to build bcrypt library
RUN apk update && apk add git python make g++ patch

# Install app dependencies
WORKDIR /usr/src/app
COPY package.json package.json
RUN yarn global add node-gyp && yarn install --production && npm rebuild bcrypt --build-from-source


# Bundle pre-built app
COPY ormconfig.prod.json ormconfig.json
COPY --from=builder /usr/src/app/dist dist

EXPOSE 3000
ENTRYPOINT yarn migrations && yarn start
