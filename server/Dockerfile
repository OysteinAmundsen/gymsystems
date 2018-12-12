FROM node:11.4-alpine as dist
WORKDIR /tmp/
RUN apk add python make g++
COPY tsconfig.json tsconfig.json ormconfig.js production.env ./
COPY src src/
COPY package.json ./
RUN yarn install
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production

FROM node:11.4-alpine
WORKDIR /usr/local/nub-api
COPY --from=dist /tmp/ ./
ENV NODE_PATH ./dist:./node_modules
EXPOSE 3000
CMD ["yarn", "start:prod"]
