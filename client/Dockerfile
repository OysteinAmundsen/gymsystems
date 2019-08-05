# ----------------------------------------------
# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
# ----------------------------------------------
FROM node:11.4-alpine as build-stage
WORKDIR /app

RUN apk update && apk upgrade; \
  apk add git;

# Single layer for dependencies to improve caching between builds
COPY package.json ./
RUN yarn install

# Copy application
COPY tsconfig.json angular.json ngsw-config.json tslint.json ./
COPY ./src ./src
COPY *.js *.ts ./

# Build application in multiple layers, so if one fails we still keep cache on the successful ones.
RUN yarn build --prod
RUN yarn build:ssr

# ----------------------------------------------
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# ----------------------------------------------
FROM nginx:1.17-alpine
# FROM node:11.4-alpine
WORKDIR /usr/share/nginx
# WORKDIR /usr/local/app

# Install dependencies
RUN echo @edge http://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories; \
  echo @edgecommunity http://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories; \
  apk update && apk upgrade; \
  apk add git; \
  apk add --update nodejs-current@edge yarn; \
  yarn global add pm2;

# Copy pre-built application
COPY --from=build-stage /app/dist/ .
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./package.json .
RUN yarn install --production

# EXPOSE 4000

# Override original image CMD in order to start our SSR server side-by-side with nginx
CMD pm2 start ./server.js --name ssr.angular && nginx -g 'daemon off;'
# CMD ["node", "server.js"]
