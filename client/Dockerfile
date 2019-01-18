# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY *.json /app/
RUN yarn install
COPY ./src /app/src
RUN yarn build --prod
RUN rm -rf node_modules yarn.lock
RUN yarn install --production

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./package.json /usr/share/nginx
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
