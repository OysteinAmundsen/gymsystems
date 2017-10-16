######################
### STAGE 1: Build ###
FROM node:8-alpine as builder

RUN apk update && apk add git python make g++ patch

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN rm -rf ./node_modules && yarn install && yarn build

######################
### STAGE 2: Setup ###
FROM node:8-alpine

# In order to build bcrypt library
RUN apk update && apk add git python make g++ patch

# Install app dependencies
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN yarn global add node-gyp && yarn install --production

# Bundle pre-built app
ADD ormconfig.prod.json /usr/src/app/ormconfig.json
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000
ENTRYPOINT yarn start
