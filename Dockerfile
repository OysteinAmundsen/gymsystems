FROM node

MAINTAINER Øystein Amundsen <oystein.amundsen@gmail.com>

# Create app directory
ENV HOME=/usr/src/app
RUN mkdir -p $HOME

# Create app user
# RUN useradd --user-group --create-home --shell /bin/bash app
# USER app
WORKDIR $HOME

# Install app dependencies
COPY package.json $HOME
RUN npm install --production

# Bundle pre-built app
ADD ormconfig.prod.json $HOME/ormconfig.json
COPY dist $HOME/dist
# RUN chown -R app:app $HOME/*

EXPOSE 3000
ENTRYPOINT npm start
